const {authJwt, verifySignUp} = require("../middlewares")
const userController = require("../controllers/user.controller")


module.exports = function(app){
    app.get("/crm/api/v1/users/", [authJwt.verifyToken, authJwt.isAdmin], userController.findAll);
    app.get("/crm/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin], userController.findById);
    app.put("/crm/api/v1/users/:userId", [authJwt.verifyToken, authJwt.isAdmin], userController.update)
}