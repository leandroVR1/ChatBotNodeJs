const whatsappService = require("../services/whatsappService");
const webhookController = require("./webhookController");

async function sendWelcomeMessage(to) {
    await whatsappService.sendMessageFunction.sendText(to, "Bienvenido a coworking riwi");
    const buttons = [
        { id: "option1coworking", title: "1. Informacion 📖" },
        { id: "option2coworking", title: "2. Contacto 📲" },
        { id: "option3coworking", title: "3. Regresar ↩️" }
    ];
    await whatsappService.sendMessageFunction.sendInteractiveMessage(to, "Selecciona una opción:", buttons);
}

async function sendCoworkingInfo(to) {
    await whatsappService.sendMessageFunction.sendText(to, "Ofrecemos un entorno dinámico y colaborativo donde profesionales de diversas industrias encuentran un lugar inspirador para trabajar, conectarse y crecer juntos.\nNuestro propósito es revolucionar la experiencia laboral, redefiniendo la forma en que las personas viven y disfrutan el trabajo.\n https://riwi.io/coworking/");
    
}

async function sendContactoDayana(to) {
    await whatsappService.sendMessageFunction.sendText(to, "Aqui va el contacto de Dayana");
}

async function sendMainMenu(to) {
    await sendWelcomeMessage(to);
}

async function closeConversation(to) {
    await whatsappService.sendMessageFunction.sendText(to, "¡Gracias por elegir Riwi! Estamos aquí para apoyarte en todo lo que necesites. Nodudes en contactarnos si tienes más preguntas.");
}

module.exports = {
    sendWelcomeMessage,
    sendCoworkingInfo,
    sendContactoDayana,
    sendMainMenu,
    closeConversation
};



