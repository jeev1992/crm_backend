const {mockRequest, mockResponse} = require('../interceptor')
const User = require('../../models/user.model')
const {update, findAll, findById} = require('../../controllers/user.controller')

const userTestPayload = {
    userId: 1,
    name: "Test",
    password: "1234567",
    userType: "CUSTOMER",
    userStatus: "APPROVED",
    email: "test@gmail.com",
    ticketsCreated: [],
    ticketsAssigned: [],
    save: jest.fn().mockReturnValue(userTestPayload),
}

describe("FindAll", () => {
    it("Should pass and return users", async () => {
        const userSpy = jest.spyOn(User, 'find').mockReturnValue(Promise.resolve([userTestPayload]))
        const req = mockRequest()
        const res = mockResponse()

        await findAll(req, res)

        expect(userSpy).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    email: "test@gmail.com",
                    name: "Test",
                    userId: 1,
                    userStatus: "APPROVED",
                    userType: "CUSTOMER"
                })
            ])
        )
    })

    it("Should fail", async () => {
        const userSpy = jest.spyOn(User, 'find').mockImplementation(() => {throw new Error("Error")})
        const req = mockRequest()
        const res = mockResponse()

        await findAll(req, res)

        expect(userSpy).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(500)

    })
})


describe("FindById", () => {
    it("Should pass and return the user", () => {

    })

    it("Should fail", () => {

    })
})

describe("Update", () => {
    it("Should pass and return the updated user", () => {
        const userSpy = jest.spyOn(User, 'findOneAndUpdate').mockImplementation(() => ({
            exec: jest.fn().mockReturnValue(userTestPayload)
        }))
    })

    it("Should fail", () => {
        
    })
})