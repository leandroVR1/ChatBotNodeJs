const whatsappService = require("../services/whatsappService");

async function sendCoderWelcomeMessage(to) {
    const buttons = [
        { id: "option1coder", title: "1. Moodle" },
        { id: "option2coder", title: "2. Riwi" },
        { id: "option3coder", title: "3. cerrar" }
    ];
    await whatsappService.sendMessageFunction.sendInteractiveMessage(to, "Selecciona una opción:", buttons);
}

async function sendMoodleLink(to) {
    await whatsappService.sendMessageFunction.sendText(to, "Aquí está el enlace de Moodle: https://moodle.riwi.io/login");
}

async function sendRiwiContacto(to) {
    await whatsappService.sendMessageFunction.sendText(to, "Aquí está el enlace de contacto Riwi: https://moodle.riwi.io/login");
}

async function sendCloseConversation(to) {
    await whatsappService.sendMessageFunction.sendText(to, "Gracias por usar nuestro servicio. ¡Hasta luego!");
}

module.exports = {
    sendCoderWelcomeMessage,
    sendMoodleLink,
    sendRiwiContacto,
    sendCloseConversation
};