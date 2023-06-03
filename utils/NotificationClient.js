var Client = require('node-rest-client').Client;

var client = new Client();

module.exports = (ticketId, subject, content, emailIds, requester) => {
    var reqBody = {
        ticketId: ticketId,
        subject: subject,
        content: content,
        recepientEmails: emailIds,
        requester: requester
    }

    var args = {
        data: reqBody,
        headers: {"Content-Type": "application/json"}
    }

    client.post("https://notification-service-zyxe.onrender.com/notificationService/api/v1/notification", args, function (data, response){
        console.log(data)
    })
}