/**
 * Configuración de enlaces externos.
 *
 * ÚNICO lugar donde se definen las URLs de la app. Para actualizar un enlace,
 * cambiar el valor acá y volver a desplegar (`firebase deploy`). No duplicar
 * estas URLs en index.html ni en ningún otro archivo.
 */
const CONFIG = {
  // Turnos y cursos (Ágora). Los cursos ya están dentro de este mismo flujo.
  turnos: "https://agora.red/cinpereyrastudio",

  // Catálogo de insumos (WhatsApp Business).
  insumos: "https://wa.me/c/5491138833558",

  // Redes sociales.
  instagram: "https://www.instagram.com/lashes.cinpereyra/",

  // Abre una conversacion normal de WhatsApp (sin /c/, que es el catalogo),
  // con el mensaje ya escrito para que la persona solo tenga que enviarlo:
  //   "¡Hola Cintia! Te escribo desde la app para hacerte una consulta 😊"
  // Para cambiar el texto hay que dejarlo codificado para URL: los espacios
  // son %20, los signos y emojis tambien van codificados.
  // Cuando se defina el numero oficial con ManyChat, se cambia solo aca.
  whatsapp: "https://wa.me/5491138833558?text=%C2%A1Hola%20Cintia!%20Te%20escribo%20desde%20la%20app%20para%20hacerte%20una%20consulta%20%F0%9F%98%8A"
};
