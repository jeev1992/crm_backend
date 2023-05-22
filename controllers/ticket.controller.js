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
            if(engineer){
                engineer.ticketsAssigned.push(ticket._id)
                await engineer.save()
            }

            return res.status(200).send(ticket)
        }
    }catch(err){
        return res.status(500).send({
            message: "Some internal server error occured"
        })
    }
}

exports.updateTicket = async (req, res) => {
    //Only one who has created the ticket can update the ticket
    const ticket = await Ticket.findOne({_id: req.params.id})

    if(ticket && ticket.reporter == req.userId){
        //Allowed to update
        ticket.title = req.body.title != undefined ? req.body.title : ticket.title,
        ticket.description = req.body.description != undefined ? req.body.description: ticket.description,
        ticket.ticketPriority = req.body.ticketPriority != undefined ? req.body.ticketPriority : ticket.ticketPriority,
        ticket.status = req.body.status != undefined ? req.body.status : ticket.status

        var updatedTicket = await ticket.save()

        return res.status(200).send(updatedTicket)
    }else{
        res.status(401).send({
            message: "Ticket can only be updated by the customer who created it"
        })
    }
}

exports.getAllTickets = async (req, res) => {
    const queryObject = {
        reporter: req.userId
    }

    if(req.query.status != undefined){
        queryObject.status = req.query.status
    }

    if(req.query.ticketPriority != undefined){
        queryObject.ticketPriority = req.query.ticketPriority
    }

    const tickets = await Ticket.find(queryObject);

    if(tickets){
        return res.status(200).send(tickets)
    }
}

exports.getOneTicket = async (req, res) => {
    const ticket = await Ticket.findOne({
        _id: req.params.id,
        reporter: req.userId
    })

    if(ticket){
        return res.status(200).send(ticket)
    }
}