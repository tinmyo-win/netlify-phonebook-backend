const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI
console.log('connecting to MongoDB')

mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDb')
    })
    .catch(error => {
        console.log('errror conncting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)