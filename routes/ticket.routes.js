const {authJwt, verifyTicketRequestBody} = require("../middlewares")
const ticketController = require('../controllers/ticket.controller')

module.exports = function(app){
    app.post("/crm/api/v1/tickets/", [authJwt.verifyToken, verifyTicketRequestBody.validateTicketRequestBody], ticketController.createTicket)
    app.put("/crm/api/v1/tickets/:id", [authJwt.verifyToken, verifyTicketRequestBody.validateTicketStatus], ticketController.updateTicket)
    app.get("/crm/api/v1/tickets", [authJwt.verifyToken], ticketController.getAllTickets)
    app.get("/crm/api/v1/tickets/:id", [authJwt.verifyToken], ticketController.getOneTicket)
}

//Two middleware functions
//1. Validate the body of ticket when it is being create dfor the first time - POST(title, description, status- not validated)
//2. Validate only the status of the ticket - PUT(OPEN, IN_PROGRESS, CLOSED, BLOCKED)