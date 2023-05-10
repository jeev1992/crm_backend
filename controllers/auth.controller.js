const constants = require("../utils/constants")
const User = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const authConfig = require("../configs/auth.config")

exports.signup = async (req, res) => {
    var userStatus = req.body.userStatus
    var userType = req.body.userType
    if(userType == constants.userTypes.customer){
        userStatus = constants.userStatus.approved
    }else{
        userStatus = constants.userStatus.pending
    }

    try{
        const createUser = await User.create({
            name: req.body.name,
            userId: req.body.userId,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            userType: req.body.userType,
            userStatus: userStatus
        })

        const postResponse = {
            name: createUser.name,
            userId: createUser.userId,
            email: createUser.email,
            userType: createUser.userType,
            userStatus: createUser.userStatus,
            createdAt: createUser.createdAt,
            updatedAt: createUser.updatedAt
        }

        res.status(200).send(postResponse)
    }catch(e){
        console.log("Error occurred while creating the user")
        res.status(500).send({
            message: "Some internal error occured while creating the user"
        })
    }
}

exports.signin = async (req, res) => {
    const user = await User.findOne({userId: req.body.userId})
    if(!user){
        res.status(400).send({
            message: "Failed! UserId doesn't exist"
        })
        return;
    }

    if(user.userStatus != constants.userStatus.approved){
        res.status(403).send({
            message: "Can't allow user to login as the status is " + user.userStatus
        })
        return;
    }

    //Check if password matches
    var isPasswordValid = bcrypt.compareSync(req.body.password, user.password)

    if(!isPasswordValid){
        return res.status(401).send({
            message: "Password provided is invalid"
        })
    }

    var token = jwt.sign({id: user.userId}, authConfig.secretKey, {
        expiresIn: 86400
    })

    res.status(200).send({
        name: user.name,
        userId: user.userId,
        email: user.email,
        userTypes: user.userType,
        userStatus: user.userStatus,
        accessToken: token
    })
}