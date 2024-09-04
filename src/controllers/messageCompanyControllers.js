const whatsappService = require("../services/whatsappService");
const webhookController = require("./webhookController");

async function sendWelcomeMessage(to) {
    
    
    const buttons = [
        { id: "option1company", title: "1. mas info" },
        { id: "option2company", title: "2. contacto" },
        { id: "option3company", title: "3. cerrar" }
      ];
      await whatsappService.sendMessageFunction.sendInteractiveMessage(to, "Selecciona una opción de nuestro apartado empresarial:", buttons);
}
async  function companyinfo(to){
    await whatsappService.sendMessageFunction.sendText(to,"Para conocer más sobre nuestros servicios, te enviaré nuestro brochure empresarial. Ahí encontrarás todos los detalles sobre cómo podemos ayudarte a potenciar tu equipo con talento Tech de primer nivel.")
    
}
async function sendcontacto(to){
    const buttons = [
        { id: "option1contacto", title: "1. contacto" },
        { id: "option2contacto", title: "2. cerrar" }
      ];
      await whatsappService.sendMessageFunction.sendInteractiveMessage(to, "SPuedes comunicarte con uno de nuestros asesores comerciales para agendar una reunión y resolver cualquier duda. Juntos, personalizaremos la solución perfecta para tu empresa.:", buttons);
}
async function sendRiwiContacto(to){
    await whatsappService.sendMessageFunction.sendText(to,"anexar link de contacto")
}
module.exports={
    sendWelcomeMessage,
    companyinfo,
    sendcontacto,
    sendRiwiContacto
};

