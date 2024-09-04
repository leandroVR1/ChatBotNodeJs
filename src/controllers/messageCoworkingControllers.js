const whatsappService = require("../services/whatsappService");
const webhookController = require("./webhookController");

async function sendWelcomeMessage(to) {
    await whatsappService.sendMessageFunction.sendText(to, "Bienvenido a coworking riwi");
    const buttons = [
        { id: "option1coworking", title: "1. Informacion" },
        { id: "option2coworking", title: "2. Contacto" },
        { id: "option4coworking", title: "3. Cerrar" }
    ];
    await whatsappService.sendMessageFunction.sendInteractiveMessage(to, "Selecciona una opción:", buttons);
}

async function sendCoworkingInfo(to) {
    await whatsappService.sendMessageFunction.sendText(to, "Aqui va la informacion del coworking con imagenes del espacio");
}

async function sendContactoDayana(to) {
    await whatsappService.sendMessageFunction.sendText(to, "Aqui va el contacto de Dayana");
}

async function sendMainMenu(to) {
    await sendWelcomeMessage(to);
}

async function closeConversation(to) {
    await whatsappService.sendMessageFunction.sendText(to, "Conversacion cerrada");
}

module.exports = {
    sendWelcomeMessage,
    sendCoworkingInfo,
    sendContactoDayana,
    sendMainMenu,
    closeConversation
};



