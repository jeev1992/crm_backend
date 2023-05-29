const db = require('../db')
const {mockRequest, mockResponse} = require('../interceptor')
const User = require('../../models/user.model')
const {signin, signup} = require('../../controllers/auth.controller')

beforeAll(async () => await db.connect())
afterEach(async () => await db.clearDatabase())
afterAll(async () => await db.closeDatabase())

const testPayload = {
    userId: "1",
    name: "Test",
    password: "12345678",
    userType: "CUSTOMER",
    email: "test@gmail.com",
    userStatus: "PENDING",
    ticketsCreated: [],
    ticketsAssigned: []
}

describe("SignUp", () => {

    it('Should pass and create the user', async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.body = testPayload

        await signup(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                email: "test@gmail.com",
                name: "Test",
                userId: "1",
                userStatus: "APPROVED",
                userType: "CUSTOMER"
            })
        )
    })

    it('Should return error while user creation', async () => {
        const spy = jest.spyOn(User, 'create').mockImplementation(cb => cb(new Error("Error occured while create"), null))
        const req = mockRequest()
        const res = mockResponse()

        testPayload.userType = 'ENGINEER'
        req.body = testPayload

        await signup(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith({
            message: "Some internal error occured while creating the user"
        })
    })

})


describe("SignIn", () => {

    it('Should fail due to password mismatch', () => {

    })

    it('Should fail as userStatus is PENDING', () => {

    })

    it('Should fail as userId doesnt exist already', () => {

    })

    it('Should pass and signIn the user', () => {

    })
})