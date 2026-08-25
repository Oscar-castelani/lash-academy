# Lash Academy Professional — PWA

Punto de entrada único al ecosistema digital de Cintia Pereyra. Es una sola
pantalla, instalable en el celular, con dos acciones principales (reservar turno
y comprar insumos) y accesos a redes sociales.

No hay backend, base de datos ni framework: HTML + CSS + JavaScript vanilla
servidos como archivos estáticos desde Firebase Hosting.

## Estructura

```
/
├── index.html          Pantalla única (incluye el CSS y el registro del SW)
├── config.js           TODOS los enlaces externos, centralizados
├── manifest.json       Metadatos de la PWA (nombre, íconos, colores)
├── service-worker.js   Cacheo de assets estáticos (funciona sin conexión)
├── firebase.json       Configuración de Firebase Hosting
├── /icons              icon.svg (original) + los PNG generados a partir de él
└── /assets             cintia.jpg (la foto del encabezado)
```

## Cómo actualizar un enlace

Todos los enlaces viven en [`config.js`](config.js). Por ejemplo, cuando se
defina el número de WhatsApp oficial integrado con ManyChat:

```js
whatsapp: "https://wa.me/XXXXXXXXXXX"
```

Después de editar, subir la versión del cache en `service-worker.js`
(`CACHE_NAME = "lash-academy-v15"`, `v11`, etc.) y desplegar. Sin ese cambio, los
celulares que ya tienen la app instalada pueden seguir viendo la versión vieja
durante un tiempo.

## El botón de ubicación

Hay dos enlaces al mismo punto en `config.js`, y el código elige según el
dispositivo:

| Dispositivo | Enlace | Qué abre |
|---|---|---|
| Android y computadoras | `ubicacion` | Google Maps |
| iPhone y iPad | `ubicacionIOS` | Mapas de Apple |

Es necesario porque en iPhone un enlace de Google Maps no abre el mapa: ofrece
descargar la app de Google desde la App Store. Mapas de Apple ya viene
instalado en todos los iPhone, así que abre directo.

**Si cambia la dirección del estudio, hay que actualizar las coordenadas en los
dos enlaces.** Están en el mismo formato (`latitud,longitud`) para que sea
fácil de comparar.

## Cómo cambiar los colores

Están definidos como variables CSS al principio del `<style>` en `index.html`:

```css
:root {
  --color-bg-top: #4A1F45;     /* arriba del degradado */
  --color-bg-mid: #8A4485;
  --color-bg-bottom: #D98FD4;  /* abajo del degradado */
  --color-surface: #FFFFFF;    /* botones */
  ...
}
```

La paleta replica la página de Ágora: degradado violeta a magenta de arriba
hacia abajo, botones blancos con texto oscuro, íconos de redes en círculos
translúcidos.

Si cambia `--color-bg-top`, actualizar también `theme_color` y
`background_color` en `manifest.json` y el `<meta name="theme-color">` de
`index.html`, para que la barra del sistema y la pantalla de carga acompañen.

## La foto del encabezado

Es `assets/cintia.jpg`, recortada en círculo por CSS. Para cambiarla, reemplazar
el archivo con **una imagen cuadrada** (mismo ancho que alto): así el recorte
circular no deforma ni corta la cara. Si la foto nueva fuera rectangular, hay
que ajustar `object-position` en `.header__logo` para dejar la cara centrada.

⚠️ La foto actual es de **150x150 px** (la resolución de la miniatura de
Instagram). Se ve bien en celulares chicos, pero en pantallas de alta densidad y
en tablets queda un poco borrosa. Conviene reemplazarla por la original en al
menos 400x400 px, con el mismo nombre de archivo.

Si el archivo faltara, la app muestra el ícono en su lugar en vez de romperse.

## El ícono de la app

El original es [`icons/icon.svg`](icons/icon.svg): el monograma **CP** en
cursiva dorada, dentro de un aro fino, sobre fondo negro. Las letras están
convertidas a curvas, así que el SVG se ve igual en cualquier máquina aunque no
tenga instalada la tipografía original (Monotype Corsiva). Los tres PNG (`icon-192`, `icon-512`, `apple-touch-icon`) se
generan a partir de ese SVG; si se edita el SVG, hay que volver a generarlos.

Cualquier conversor de SVG a PNG sirve. Los tamaños necesarios son 512x512,
192x192 y 180x180. Como están declarados `maskable`, todo el dibujo tiene que
quedar dentro del **80% central** de la imagen para que Android no lo recorte al
aplicar la máscara circular del sistema (el SVG ya respeta ese margen).

## Velocidad de carga

La primera visita descarga **4 archivos, ~15 KB comprimidos**: el HTML (con el
CSS y el JS adentro, sin pedidos extra), `config.js`, la foto y el SVG del
ícono. No hay frameworks, ni webfonts, ni librerías externas.

Las decisiones que sostienen ese número, por si alguien las toca sin querer:

- **El CSS y el JS van dentro de `index.html`.** Son chicos; separarlos en
  archivos sumaría dos pedidos de red sin ganar nada.
- **El ícono del cartel de instalación usa el SVG (2 KB), no el PNG (20 KB)**, y
  ni siquiera se pide en la carga inicial: se descarga recién cuando el cartel
  aparece.
- **Los PNG del ícono no se precachean al instalar el service worker.** Pesan
  ~80 KB entre los tres y la pantalla no los usa: los descarga el sistema
  operativo cuando se instala la app. Se guardan después, sin frenar nada.
- **La foto está en 5 KB.** Si se reemplaza por una de mejor resolución (ver más
  arriba), conviene que quede **por debajo de 40 KB**: exportarla como JPG con
  calidad 80 y a 400x400 alcanza y sobra. Es el único archivo que no comprime el
  servidor, porque el JPG ya viene comprimido.
- Tanto GitHub Pages como Firebase comprimen con gzip/brotli automáticamente. No
  hay que configurar nada.

A partir de la segunda visita el service worker sirve todo desde el celular, así
que la pantalla aparece al instante y sin usar datos.

## Probar en local

Un `file://` no alcanza: los service workers requieren `http://localhost` o
HTTPS. Con Firebase CLI instalado:

```bash
firebase serve
```

O sin Firebase, con cualquier servidor estático:

```bash
npx serve .
```

Y abrir `http://localhost:5000` (o el puerto que indique el comando).

## Deploy a GitHub Pages

Es la opción más simple si el código ya va a estar en GitHub: no hace falta
instalar nada más que Git, y el hosting con HTTPS es gratis.

Todas las rutas del proyecto son **relativas**, así que funciona igual en la
raíz del dominio que en un subdirectorio (`usuario.github.io/repo/`), que es
como sirve GitHub Pages los repositorios comunes.

### 1. Crear el repositorio en GitHub

Entrar a [github.com/new](https://github.com/new) y crear un repositorio:

- **Nombre**: por ejemplo `lash-academy` (va a formar parte de la URL final).
- **Visibilidad**: **Public**. Con repositorio privado, Pages solo funciona en
  planes pagos.
- **No** tildar "Add a README file" ni ninguna otra opción: el repo tiene que
  quedar vacío.

### 2. Subir el proyecto

Desde una terminal parada en la carpeta del proyecto:

```bash
git init -b main
```

```bash
git add .
```

```bash
git commit -m "PWA Lash Academy Professional"
```

```bash
git remote add origin https://github.com/USUARIO/lash-academy.git
```

(reemplazando `USUARIO` y el nombre del repo por los reales)

```bash
git push -u origin main
```

La primera vez GitHub pide autenticarse. Si abre una ventana del navegador,
alcanza con iniciar sesión ahí.

### 3. Activar GitHub Pages

En el repositorio: **Settings** → **Pages** (menú de la izquierda).

- En **Source**, elegir **Deploy from a branch**.
- En **Branch**, elegir `main` y la carpeta `/ (root)`.
- **Save**.

### 4. Obtener el enlace

Después de guardar, GitHub tarda entre 1 y 3 minutos en publicar. Al recargar
esa misma pantalla de Settings → Pages aparece arriba el enlace:

```
https://USUARIO.github.io/lash-academy/
```

Esa es la URL que va en la bio de Instagram. Es HTTPS, así que la PWA se puede
instalar sin problema.

### Actualizar el sitio más adelante

Cada `push` a `main` republica el sitio solo:

```bash
git add . && git commit -m "Actualizo enlaces" && git push
```

### Un detalle de GitHub Pages

Pages sirve los archivos con `Cache-Control: max-age=600`, así que un cambio
puede tardar hasta 10 minutos en verse (o hay que forzar recarga con
`Ctrl+F5`). Por eso conviene subir igual la versión de `CACHE_NAME` en
`service-worker.js` cuando se cambia algo.

### Si preferís una URL sin el nombre del repo

Nombrando al repositorio exactamente `USUARIO.github.io`, el sitio se publica en
`https://USUARIO.github.io/` (sin subcarpeta). El resto de los pasos es igual.

## Deploy a Firebase Hosting

Alternativa a GitHub Pages. Conviene si más adelante se quiere usar Firebase
Analytics, un dominio propio con certificado gestionado, o reglas de cache
propias (este repo ya trae un `firebase.json` con headers `no-cache` para los
archivos que cambian seguido, algo que en Pages no se puede configurar).

Requisitos: Node.js instalado y una cuenta de Google con acceso al proyecto de
Firebase.

1. Instalar la CLI (una sola vez, global):

```bash
npm install -g firebase-tools
```

2. Iniciar sesión (una sola vez por máquina):

```bash
firebase login
```

3. Vincular la carpeta con el proyecto de Firebase (una sola vez):

```bash
firebase init hosting
```

Respuestas al asistente:
- **Use an existing project** → elegir el proyecto (o crear uno nuevo desde la
  consola de Firebase antes de este paso).
- **Public directory** → `.` (punto: la raíz del repo).
- **Configure as a single-page app?** → **No**.
- **Set up automatic builds with GitHub?** → No.
- **Overwrite index.html?** → **No** (importante: no pisar el archivo).

Este repo ya incluye un `firebase.json` con la configuración correcta; si el
asistente lo sobrescribe, revisar que siga teniendo los headers `no-cache` de
`service-worker.js`, `index.html`, `config.js` y `manifest.json`.

4. Desplegar:

```bash
firebase deploy --only hosting
```

La CLI imprime la URL pública (`https://<proyecto>.web.app`). Esa es la que va
en la bio de Instagram.

## El cartel de "Descargá la app"

Aparece abajo de todo, solo si la app **no** está instalada. La lógica está al
final de `index.html`. El botón **Instalar** está siempre y siempre hace algo:

1. **Android (Chrome/Edge)**: el navegador avisa con `beforeinstallprompt` y el
   botón abre el diálogo nativo de instalación.
2. **Cualquier otro caso** (iPhone, navegador embebido, Firefox, o un Chrome que
   todavía no disparó el evento): el botón despliega los pasos concretos para
   ese navegador.

### Por qué en iPhone no se instala con un toque

No es una limitación de la app: **Apple no le da a las páginas web ninguna
forma de instalarse solas**. El evento `beforeinstallprompt` no existe en
Safari y no hay API equivalente. "Agregar a inicio" solo lo puede disparar la
persona desde el menú Compartir; ningún sitio web puede hacerlo por ella, ni
las apps grandes.

En Android sí funciona con un toque: el botón abre el diálogo del sistema y la
app se instala sola.

Por eso en iPhone el botón despliega los tres pasos con el ícono real de
Compartir dibujado dentro del texto y una flecha que apunta a la barra de
Safari, que es donde está ese botón. Es lo más cerca de "automático" que la
plataforma permite.

Si la persona está en Chrome o Firefox de iPhone, el cartel le pide que abra el
enlace en Safari: en esos navegadores el menú de compartir está en otro lugar y
confunde.

### Si Android muestra "Aplicación no segura bloqueada"

Es un aviso de **Google Play Protect**, y **no es sobre el sitio**. Cuando se
instala una PWA en Android, el navegador arma un paquete (un APK chiquito) que
envuelve la app. Ese paquete lo genera el navegador, no este proyecto: desde el
código no hay nada que se pueda cambiar para evitarlo.

El texto "se desarrolló para usarse en una versión anterior de Android" quiere
decir que ese paquete apunta a una versión vieja del sistema. Pasa sobre todo
con **Samsung Internet**, que arma el paquete por su cuenta. Chrome usa el
servicio de Google, que genera paquetes al día, y no da ese problema.

Las dos salidas, en orden:

1. **Instalar desde Chrome.** Abrir el mismo enlace en Chrome y tocar Instalar.
2. **Menú ⋮ → "Agregar a pantalla de inicio".** No arma ningún paquete, así que
   Play Protect ni se entera. El ícono queda igual en la pantalla del teléfono.

La app lo contempla: si la persona acepta instalar y 15 segundos después el
navegador no confirmó la instalación (evento `appinstalled`), el cartel vuelve
a aparecer con esas dos salidas. Y si detecta Samsung Internet, los pasos ya
avisan de entrada.

### El caso del navegador de Instagram

Es el más importante, porque el enlace se comparte justamente desde la bio de
Instagram. **El navegador interno de Instagram no puede instalar PWAs**: no
existe la opción, ni por diálogo nativo ni por menú. Lo mismo vale para los
navegadores embebidos de Facebook, TikTok y similares.

Por eso se detectan por user agent y, en ese caso, el cartel explica que hay que
abrir el enlace en Chrome o Safari (menú de tres puntos → "Abrir en el
navegador"). Sin ese aviso el botón parece roto: la persona lo toca y no pasa
nada, porque el navegador no tiene forma de instalar.

### Comportamiento del cartel

Si la persona lo cierra con la X, no vuelve a aparecer por 14 días (una marca de
tiempo en `localStorage`; no se guarda ningún dato personal). Tampoco aparece si
la app ya está corriendo instalada, ni después de que el sistema confirma la
instalación.

Al desplegar los pasos el cartel crece, así que reserva espacio abajo para no
tapar los íconos de redes. En pantallas de menos de 700px de alto deja de flotar
y pasa al flujo, debajo de las redes, y la página scrollea.

Para volver a verlo mientras se prueba, borrar la clave
`lash-install-descartado` del `localStorage` desde la consola del navegador:

```bash
localStorage.removeItem('lash-install-descartado')
```

## Verificar la instalación

- **Android (Chrome)**: abrir la URL → menú ⋮ → "Instalar aplicación". Si no
  aparece, revisar en DevTools → Application → Manifest que no haya errores.
- **iOS (Safari)**: abrir la URL → botón Compartir → "Agregar a inicio".
- **Offline**: instalar, activar modo avión y abrir la app; la pantalla debe
  cargar igual (los enlaces externos, lógicamente, necesitan conexión).
