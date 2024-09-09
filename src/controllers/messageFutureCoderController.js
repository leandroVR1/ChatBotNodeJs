const whatsappService = require("../services/whatsappService");

async function sendWelcomeMessage(to) {
  await whatsappService.sendMessageFunction.sendText(to, "¡Bienvenido! 🎉 Estoy aquí para ayudarte a descubrir lo que significa ser un coder y cómo puedes comenzar tu viaje en este emocionante mundo. ¿En qué puedo ayudarte hoy? 💻");
  const buttons = [
    { id: "option1coder", title: "1. En qué consiste" },
    { id: "option2coder", title: "2. Inscripción" },
    { id: "option3coder", title: "3. Más opciones 🔽" },
  ];
  await whatsappService.sendMessageFunction.sendInteractiveMessage(to, "Selecciona una opción:", buttons);
}
async function sendMenu2(to) {

  const buttons = [
    { id: "option1coder", title: "1. En qué consiste" },
    { id: "option2coder", title: "2. Inscripción" },
    { id: "option3coder", title: "3. Más opciones 🔽" },
  ];
  await whatsappService.sendMessageFunction.sendInteractiveMessage(to, "Selecciona otra opcion:", buttons);
}
async function coderInfo(to) {
  await whatsappService.sendMessageFunction.sendText(to, "Ser un *Coder* significa ser un arquitecto del mundo digital 🌍. \nEs una persona que no solo escribe código, sino que también comprende y domina lenguajes de programación como _Python_ , _JavaScript_ , _entre otros_. \nUn *Coder* se dedica al desarrollo integral de software 💻 ya sea para aplicaciones web o móviles, enfocándose en construir la lógica 🔍 detrás de las funciones, manejar datos eficientemente  y realizar análisis que aseguren que el software opere de manera óptima ⚙️\nSu objetivo es garantizar que la experiencia del usuario sea fluida 🚀 y que el software sea escalable  y adaptable a nuevas necesidades .");
}

async function coderRegistration(to) {
  await whatsappService.sendMessageFunction.sendText(to, "¡Hola! 😊 estamos felices de estar en contacto contigo. \nEstás a solo un paso de comenzar un emocionante viaje para convertirte en un coder. A continuación, te compartimos toda la información necesaria y el enlace a nuestra página web 🌐 donde podrás completar tu inscripción de manera rápida y sencilla.Aquí está el proceso de inscripción...");
  await whatsappService.sendMessageFunction.sendText(to, "Te deseamos mucho éxito 🍀 en este nuevo desafío y estamos aquí para apoyarte en cada paso del camino. 📌 Inscríbete aquí: https://riwi.io/curso/#Aplicacion Si tienes alguna pregunta o necesitas más información, no dudes en contactarme 💬. ¡Estoy aquí para ayudarte!")
}
async function coderAdvisor(to) {
  await whatsappService.sendMessageFunction.sendText(to, "¿Necesitas más información o tienes alguna pregunta específica? No te preocupes, estamos aquí para ayudarte. Si deseas hablar con uno de nuestros asesores, simplemente házmelo saber, y te pondremos en contacto con un experto que te guiará y resolverá todas tus dudas. ¡Estamos aquí para apoyarte en cada paso de tu camino hacia ser un coder! 💬");
}
async function sendMoreOptionsMessage(to) {
  const buttons = [
    { id: "option4coder", title: "4. Hablar con Asesor" },
    { id: "option5coder", title: "5. Regresar al menú" },
    { id: "option6coder", title: "6. Finalizar 🚪" },
  ];
  await whatsappService.sendMessageFunction.sendInteractiveMessage(to, "Más opciones Futuro Coder:", buttons);
}
async function sendReturnMessage(to) {
  await whatsappService.sendMessageFunction.sendText(to, "Si quieres explorar otras opciones o necesitas revisar más información, puedes regresar al menú principal en cualquier momento. Solo indícalo, y te llevaré de vuelta para que puedas continuar explorando todas las posibilidades que tenemos para ti. 🚀");
}
async function sendFinishMessage(to) {
  await whatsappService.sendMessageFunction.sendText(to, "¿Estás listo para continuar por tu cuenta? Si deseas finalizar nuestra conversación por ahora, puedes hacerlo cuando quieras. Recuerda que siempre estamos aquí si necesitas más ayuda en el futuro. ¡Gracias por tu tiempo y buena suerte en tu camino hacia ser un coder! 👋");
}
module.exports = {
  sendWelcomeMessage,
  coderInfo,
  coderRegistration,
  sendMoreOptionsMessage,
  coderAdvisor,
  sendFinishMessage,
  sendReturnMessage,
  sendMenu2
};