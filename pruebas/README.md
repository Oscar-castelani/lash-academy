# Banco de pruebas del cartel de instalación

Simula los distintos navegadores y teléfonos sin necesitar los dispositivos
reales. Carga `index.html` en un iframe con el entorno falsificado (user agent,
`display-mode`) y dispara los mismos eventos que dispara el navegador:
`beforeinstallprompt`, la elección de la persona y `appinstalled`.

Sirve para verificar la lógica del cartel: qué mensaje aparece en cada
navegador, qué pasa si la instalación no se completa, si el cartel respeta el
descarte de 14 días, etc.

## Cómo correrlo

1. Levantar la app en local (ver el README principal) y abrirla en el navegador.
2. Abrir la consola (F12 → Console).
3. Cargar el banco:

```bash
var s=document.createElement('script');s.src='/pruebas/banco-de-pruebas.js';document.head.appendChild(s)
```

4. Correr un escenario. Por ejemplo, iPhone con Safari:

```bash
(async()=>{const B=window.BancoDePruebas;B.olvidarDescarte();const c=await B.montar({ua:B.UA.safariIphone});await B.esperar(1500);c.doc.getElementById('install-btn').click();await B.esperar(200);console.log(B.estado(c));B.limpiar(c)})()
```

`B.UA` trae los user agents listos: `chromeAndroid`, `samsung`, `safariIphone`,
`chromeIphone`, `instagram`.

## Escenarios cubiertos

| Escenario | Qué se espera |
|---|---|
| Chrome Android con evento nativo | Cartel al instante, botón abre el diálogo del sistema, sin instrucciones |
| La persona rechaza la instalación | El cartel sigue a la vista; un segundo toque muestra las instrucciones |
| Samsung Internet | Los pasos avisan de Play Protect antes de que la bloquee |
| Chrome Android sin evento | Menú del navegador, sin mencionar Samsung |
| iPhone con Safari | Los 3 pasos, con el ícono de Compartir y la flecha a la barra |
| Chrome/Firefox en iPhone | Pide abrir el enlace en Safari |
| Navegador de Instagram | Explica que ese navegador no puede instalar apps |
| Ya instalada | El cartel no aparece nunca |
| Cerrada con la X | No vuelve a aparecer |
| Instalación bloqueada | A los 15s vuelve el cartel con las dos salidas, aun si se había cerrado antes |
| Instalación exitosa | No aparece ninguna falsa alarma |

## Dos cosas que aprendimos escribiendo estas pruebas

- **El service worker intercepta el `fetch` del banco.** Hay que pedir
  `index.html` con una query única, o las pruebas corren contra la copia
  cacheada y no contra el archivo que se acaba de editar.
- **Todos los iframes comparten `localStorage`.** Si dos escenarios corren a la
  vez, el `appinstalled` de uno marca "descartado" para el otro. Conviene
  correrlos de a uno y limpiar con `B.olvidarDescarte()`.

## Lo que esto NO puede probar

El bloqueo de **Google Play Protect** en sí. Ese bloqueo lo hace Android sobre
el APK que genera el navegador, y para reproducirlo hace falta un dispositivo o
emulador Android con Google Play Services y Samsung Internet instalados. Lo que
sí se verifica acá es la reacción de la app: que cuando la instalación no se
completa, la persona reciba una salida clara.
