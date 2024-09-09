const whatsappService = require("../services/whatsappService");
const messageCompanyController = require("./messageCompanyControllers");
async function sendWelcomeMessage(to) {
  await whatsappService.sendMessageFunction.sendImage(to, "https://www.estamosenlinea.co/wp-content/uploads/2023/11/riwi.jpg", "👋 ¡Hola! Para comenzar, debes aceptar los términos y condiciones");
}

async function sendTermsAndConditions(to) {
  const buttons = [
    { id: "accept_terms", title: "Sí ✅" },
    { id: "decline_terms", title: "No ❌" }
  ];
  await whatsappService.sendMessageFunction.sendInteractiveMessage(to, "¿Aceptas los términos y condiciones?", buttons);
}
async function sendMessageTime(to) {
  await whatsappService.sendMessageFunction.sendText(to,"Hola, ¿Continuas con nosotros?")
}
async function askForName(to) {
  await whatsappService.sendMessageFunction.sendText(to, "Por favor, dime tu nombre.");
}

async function askForEmail(to) {
  await whatsappService.sendMessageFunction.sendText(to, "Ahora, por favor, dime tu correo electrónico.");
}
async function sendBye(to) {
    await whatsappService.sendMessageFunction.sendText(to, "¡Gracias por elegir Riwi! Estamos aquí para apoyarte en todo lo que necesites. No dudes en contactarnos si tienes más preguntas.");
}
async function confirmData(to, data, type) {
  const buttons = [
    { id: `confirm_${type}`, title: "Sí ✅" },
    { id: `retry_${type}`, title: "No ❌" }
  ];
  await whatsappService.sendMessageFunction.sendInteractiveMessage(to, `¿Es este tu ${type}? ${data}`, buttons);
}

async function sendInitialMenuMessage(to) {
  await whatsappService.sendMessageFunction.sendText(to, "¡Bienvenido! Soy *_RiwiBot_*, tu asistente virtual.\nEstoy aquí para mostrarte cómo *Riwi* transforma el futuro con innovación y ayudarte con lo que necesites.\n¿en qué puedo ayudarte hoy?");
  const buttons = [
    { id: "option1", title: "1.Futuro Coder 💻" },
    { id: "option2", title: "2.Empresa 🏢" },
    { id: "option3", title: "Más opciones🔽" }
  ];
  await whatsappService.sendMessageFunction.sendInteractiveMessage(to, "Selecciona una opción:", buttons);
  await console.log(buttons);
  
}
async function sendCompany(to) {
   await messageCompanyController.sendWelcomeMessage(to); 
}
async function sendSecondaryMenuMessage(to) {
  const buttons = [
    { id: "option4", title: "4.Coworking 🏠" },
    { id: "option5", title: "5.Únete a nosotros 🤝" },
    { id: "option6", title: "6.Cerrar 🚪" }
  ];

  await whatsappService.sendMessageFunction.sendInteractiveMessage(to, "Selecciona una opción:", buttons);
}
async function sendMessageTimeOutButton(to) {
  const buttons = [
    { id: `opcion1In`, title: "Sí ✅" },
    { id: `opcion2Out`, title: "No ❌" }
  ];
  await whatsappService.sendMessageFunction.sendInteractiveMessage(to, "¿Deseas continuar con nosotros?", buttons);
}
module.exports = {
  sendWelcomeMessage,
  sendTermsAndConditions,
  askForName,
  askForEmail,
  confirmData,
  sendInitialMenuMessage,
  sendSecondaryMenuMessage,sendCompany,sendBye,sendMessageTime,sendMessageTimeOutButton
};
