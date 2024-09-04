const whatsappService = require("../services/whatsappService");
const webhookController = require("./webhookController");

async function sendWelcomeMessage(to) {
    
    await whatsappService.sendMessageFunction.sendText(to," bievenido a empresas riwi");
    const buttons = [
        { id: "option1company", title: "1. mas info" },
        { id: "option2company", title: "2. contacto" },
        { id: "option3company", title: "3. cerrar" }
      ];
      await whatsappService.sendMessageFunction.sendInteractiveMessage(to, "Selecciona una opción:", buttons);
}
async  function companyinfo(to){
    await whatsappService.sendMessageFunction.sendText(to,"Aqui va el mensaje con los pdfs")

}
async function sendcontacto(to){
    await whatsappService.sendMessageFunction.sendText(to,"Aqui va el link del chat con el asesor")
}

module.exports={
    sendWelcomeMessage,
    companyinfo,
    sendcontacto
};

