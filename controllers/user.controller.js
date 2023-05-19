const User = require("../models/user.model")
const convertUserObject = require("../utils/convertUserObject")

exports.findAll = async (req, res) => {
    try{
        let users = await User.find()
        if(users){
            return res.status(200).send(convertUserObject.userResponse(users))
        }
    }catch(err){
        return res.status(500).send({
            message: "Some internal error occured"
        })
    }
}

exports.findById = async (req, res) => {
    const userIdRequest = req.params.userId

    const user = await User.find({
        userId: userIdRequest
    })

    if(user.length > 0){
        return res.status(200).send(convertUserObject.userResponse(user))
    }else{
        return res.status(200).send({
            message: `User with id ${userIdRequest} is not present`
        })
    }
}

exports.update = (req, res) => {

}