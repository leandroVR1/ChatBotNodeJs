const whatsappService = require("../services/whatsappService");

async function sendCoderWelcomeMessage(to) {
    const buttons = [
        { id: "option1coder", title: "1. Moodle" },
        { id: "option2coder", title: "2. Riwi" },
        { id: "option3coder", title: "3. más opciones" }
    ];
    await whatsappService.sendMessageFunction.sendInteractiveMessage(to, "Selecciona una opción:", buttons);
}

async function sendMoodleLink(to) {
    await whatsappService.sendMessageFunction.sendText(to, "Aquí está el enlace de Moodle:https://moodle.riwi.io/login");
}

async function sendRiwiContacto(to) {
    await whatsappService.sendMessageFunction.sendText(to, "Aquí está el enlace de contacto Riwi:https://moodle.riwi.io/login");
}

async function sendMoreOptions(to) {
    const buttons = [
        { id: "option4coder", title: "4. regresar" },
        { id: "option5coder", title: "5. cerrar" }
    ];
    await whatsappService.sendMessageFunction.sendInteractiveMessage(to, "Selecciona una opción:", buttons);
}

async function sendBack(to) {
    await sendCoderWelcomeMessage(to);
}

async function sendCloseConversation(to) {
    await whatsappService.sendMessageFunction.sendText(to, "Gracias por usar nuestro servicio. ¡Hasta luego!");
}

module.exports = {
    sendCoderWelcomeMessage,
    sendMoodleLink,
    sendRiwiContacto,
    sendMoreOptions,
    sendBack,
    sendCloseConversation
};