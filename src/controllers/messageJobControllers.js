const whatsappService = require("../services/whatsappService");

async function sendJobInfo(to) {
    await whatsappService.sendMessageFunction.sendText(to, "Aquí está el link para trabajar con nosotros: https://riwi.io/trabaja-con-nosotros/");
    const buttons = [
        { id: "option1job", title: "1. Regresar al menú principal" },
        { id: "option2job", title: "2. Cerrar conversación" }
    ];
    await whatsappService.sendMessageFunction.sendInteractiveMessage(to, "Selecciona una opción:", buttons);
}

async function sendMainMenu(to) {
    await whatsappService.sendMessageFunction.sendText(to, "Regresando al menú principal...");
}

async function closeConversation(to) {
    await whatsappService.sendMessageFunction.sendText(to, "Conversación cerrada");
}

module.exports = {
    sendJobInfo,
    sendMainMenu,
    closeConversation
};