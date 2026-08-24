/**
 * Configuración de enlaces externos.
 *
 * ÚNICO lugar donde se definen las URLs de la app. Para actualizar un enlace,
 * cambiar el valor acá y volver a desplegar. No duplicar estas URLs en
 * index.html ni en ningún otro archivo.
 */
const CONFIG = {
  // Pantalla de reserva de Ágora (directo, sin pasar por el inicio).
  // Los cursos siguen estando dentro del mismo flujo de Ágora.
  turnos: "https://agora.red/cinpereyrastudio/reservar",

  // Catálogo de insumos (WhatsApp Business). El "/c/" es lo que abre el
  // catálogo en vez de una conversación.
  insumos: "https://wa.me/c/5491138833558",

  // --- Redes y contacto -----------------------------------------------------

  instagram: "https://www.instagram.com/lashes.cinpereyra/",

  // Conversación normal de WhatsApp (sin "/c/"), con el mensaje ya escrito
  // para que la persona solo tenga que enviarlo:
  //   "¡Hola Cintia! Te escribo desde la app para hacerte una consulta 😊"
  // Para cambiar el texto hay que dejarlo codificado para URL: los espacios
  // son %20, y los signos y emojis también van codificados.
  // Cuando se defina el número oficial con ManyChat, se cambia solo acá.
  whatsapp: "https://wa.me/5491138833558?text=%C2%A1Hola%20Cintia!%20Te%20escribo%20desde%20la%20app%20para%20hacerte%20una%20consulta%20%F0%9F%98%8A",

  // Ubicación del estudio: 34°31'21.4"S 58°45'37.1"O.
  //
  // Hay dos enlaces al mismo punto porque cada teléfono trae su app de mapas.
  // El código elige uno u otro según el dispositivo (ver index.html):
  //  - Android y computadoras -> Google Maps.
  //  - iPhone y iPad -> Mapas de Apple. Con un enlace de Google Maps, el
  //    iPhone ofrece descargar la app de Google en vez de abrir el mapa.
  //
  // Si cambia la dirección, actualizar las coordenadas en LOS DOS.
  ubicacion: "https://www.google.com/maps/search/?api=1&query=-34.5226111,-58.7603055",
  ubicacionIOS: "https://maps.apple.com/?ll=-34.5226111,-58.7603055&q=Lash%20Academy%20Professional&z=17"
};
