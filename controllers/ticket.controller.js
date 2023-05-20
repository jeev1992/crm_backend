const User = require("../models/user.model")
const Ticket = require("../models/ticket.model")
const constants = require("../utils/constants")

exports.createTicket = async (req, res) => {
    const ticketObject = {
        title: req.body.title,
        ticketPriority: req.body.ticketPriority,
        description: req.body.description,
        status: req.body.status,
        reporter: req.userId //this is coming from authJwt middleware
    }

    //Assign an engineer to the ticket which is in Approved state
    const engineer = await User.findOne({
        userType: constants.userTypes.engineer,
        userStatus: constants.userStatus.approved
    })

    ticketObject.assignee = engineer.userId

    try{
        const ticket = await Ticket.create(ticketObject)

        if(ticket){
            //Update the customer
            const user = await User.findOne({
                userId: req.userId
            })

            user.ticketsCreated.push(ticket._id);
            await user.save()

            //Update the engineer
        }
    }catch(err){

    }
}

exports.updateTicket = (req, res) => {

}

exports.getAllTickets = (req, res) => {

}

exports.getOneTicket = (req, res) => {

}