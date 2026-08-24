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
(`CACHE_NAME = "lash-academy-v7"`, `v8`, etc.) y desplegar. Sin ese cambio, los
celulares que ya tienen la app instalada pueden seguir viendo la versión vieja
durante un tiempo.

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

Aparece flotando abajo de todo, solo si la app **no** está instalada. La lógica
está al final de `index.html` y contempla tres casos:

1. **Android (Chrome/Edge)**: el navegador avisa con el evento
   `beforeinstallprompt`. El cartel muestra el botón **Instalar**, que abre el
   diálogo nativo de instalación.
2. **iPhone/iPad (Safari)**: iOS no tiene esa API. El cartel muestra la
   instrucción "Tocá Compartir y elegí Agregar a inicio", sin botón.
3. **Cualquier otro navegador**: si a los 3 segundos no hubo evento, se muestra
   un aviso genérico que apunta al menú del navegador.

Si la persona cierra el cartel con la X, no vuelve a aparecer por 14 días (se
guarda una marca de tiempo en `localStorage`; no se guarda ningún dato
personal). Tampoco aparece si la app ya está corriendo instalada, ni después de
que el sistema confirma la instalación.

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
