/**
 * Banco de pruebas del cartel de instalación.
 *
 * Carga index.html dentro de un iframe con el entorno falsificado (user agent,
 * display-mode) y dispara los mismos eventos que dispararía el navegador real:
 * beforeinstallprompt, la eleccion del usuario y appinstalled.
 *
 * Se pega en la consola del navegador con la app servida en localhost:5000.
 */
window.BancoDePruebas = (function () {
  var BASE = location.origin + '/';
  var CLAVE = 'lash-install-descartado';

  var UA = {
    chromeAndroid: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    samsung: 'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0.0.0 Mobile Safari/537.36',
    safariIphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
    chromeIphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.0.0 Mobile/15E148 Safari/604.1',
    instagram: 'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36 Instagram 302.0.0.23.113 Android'
  };

  var htmlCache = null;

  async function traerHtml() {
    if (htmlCache) return htmlCache;
    // Query unica: sin esto el service worker responde con su copia
    // cacheada y las pruebas corren contra una version vieja del archivo.
    var texto = await (await fetch('index.html?sinCache=' + Date.now(), { cache: 'no-store' })).text();
    // El iframe se escribe sobre about:blank, así que hace falta una base para
    // que config.js, la foto y los íconos resuelvan bien.
    htmlCache = texto.replace('<head>', '<head>\n<base href="' + BASE + '">');
    return htmlCache;
  }

  /**
   * Levanta la app en un iframe con el entorno falsificado.
   * opciones: { ua, instalada, ancho, alto }
   */
  async function montar(opciones) {
    var html = await traerHtml();
    var f = document.createElement('iframe');
    f.style.cssText = 'position:fixed;left:-9999px;top:0;width:' +
      (opciones.ancho || 390) + 'px;height:' + (opciones.alto || 844) + 'px;border:0;';
    document.body.appendChild(f);

    var win = f.contentWindow;

    Object.defineProperty(win.navigator, 'userAgent', {
      get: function () { return opciones.ua; },
      configurable: true
    });

    if (opciones.instalada) {
      var mmOriginal = win.matchMedia.bind(win);
      win.matchMedia = function (consulta) {
        if (consulta.indexOf('display-mode: standalone') >= 0) {
          return { matches: true, addListener: function () {}, addEventListener: function () {} };
        }
        return mmOriginal(consulta);
      };
    }

    var doc = f.contentDocument;
    doc.open();
    doc.write(html);
    doc.close();

    await new Promise(function (r) { setTimeout(r, 120); });
    return { marco: f, win: win, doc: doc };
  }

  /** Dispara el evento que Chrome dispara cuando la app es instalable. */
  function dispararPrompt(ctx, eleccion) {
    var registro = { promptLlamado: false };
    var e = new ctx.win.Event('beforeinstallprompt', { cancelable: true });
    e.prompt = function () {
      registro.promptLlamado = true;
      return Promise.resolve();
    };
    e.userChoice = Promise.resolve({ outcome: eleccion || 'accepted' });
    ctx.win.dispatchEvent(e);
    return registro;
  }

  function dispararAppInstalled(ctx) {
    ctx.win.dispatchEvent(new ctx.win.Event('appinstalled'));
  }

  function estado(ctx) {
    var cartel = ctx.doc.getElementById('install');
    var pasos = ctx.doc.getElementById('install-pasos');
    var boton = ctx.doc.getElementById('install-btn');
    return {
      cartelVisible: !cartel.hidden,
      titulo: ctx.doc.querySelector('.install__title').textContent,
      pista: ctx.doc.getElementById('install-hint').textContent,
      botonVisible: !boton.hidden,
      pasosVisibles: !pasos.hidden,
      pasos: pasos.textContent
    };
  }

  function limpiar(ctx) {
    if (ctx && ctx.marco && ctx.marco.parentNode) ctx.marco.parentNode.removeChild(ctx.marco);
  }

  function olvidarDescarte() {
    try { localStorage.removeItem(CLAVE); } catch (e) {}
  }

  function esperar(ms) {
    return new Promise(function (r) { setTimeout(r, ms); });
  }

  return {
    UA: UA,
    montar: montar,
    dispararPrompt: dispararPrompt,
    dispararAppInstalled: dispararAppInstalled,
    estado: estado,
    limpiar: limpiar,
    olvidarDescarte: olvidarDescarte,
    esperar: esperar
  };
})();
