const authController = require('../controllers/auth.controller')
const {verifySignUp} = require('../middlewares')

module.exports =  function(app){
    app.post("/crm/api/v1/auth/signup", [verifySignUp.validateSignUpRequest], authController.signup)
    app.post("/crm/api/v1/auth/signin", authController.signin)
}