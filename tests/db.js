const mongoose = require('mongoose')
const {MongoMemoryServer} = require('mongodb-memory-server')

let mongod

//Connect to db
module.exports.connect = async () => {
    if(!mongod){
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        const mongooseOpts = {
            maxPoolSize: 10,
            useUnifiedTopology: true
        }
        mongoose.connect(uri, mongooseOpts)
    }
}

//disconnect and close connection
module.exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if(mongod){
        await mongod.stop()
    }
}

//clear the db, remove all the data
module.exports.clearDatabase = async () => {
    const collections = await mongoose.connection.collections

    for(const c in collections){
        const collection = collections[c]
        collection.deleteMany()
    }
}