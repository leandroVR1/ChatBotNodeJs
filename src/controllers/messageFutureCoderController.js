const whatsappService = require("../services/whatsappService");

async function sendWelcomeMessage(to) {
  await whatsappService.sendMessageFunction.sendText(to, "Bienvenido a Futuro Coder 💻");
  const buttons = [
    { id: "option1coder", title: "1. En qué consiste" },
    { id: "option2coder", title: "2. Inscripción" },
    { id: "option3coder", title: "3. Más opciones 🔽" },
  ];
  await whatsappService.sendMessageFunction.sendInteractiveMessage(to, "Selecciona una opción:", buttons);
}

async function coderInfo(to) {
  await whatsappService.sendMessageFunction.sendText(to, "Aquí te explicamos en qué consiste ser un Coder...");
}

async function coderRegistration(to) {
  await whatsappService.sendMessageFunction.sendText(to, "Aquí está el proceso de inscripción...");
}

async function sendMoreOptionsMessage(to) {
  const buttons = [
    { id: "option4coder", title: "4. Hablar con Asesor" },
    { id: "option5coder", title: "5. Regresar al menú" },
    { id: "option6coder", title: "6. Finalizar 🚪" },
  ];
  await whatsappService.sendMessageFunction.sendInteractiveMessage(to, "Más opciones Futuro Coder:", buttons);
}

module.exports = {
  sendWelcomeMessage,
  coderInfo,
  coderRegistration,
  sendMoreOptionsMessage
};