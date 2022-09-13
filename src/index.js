const { response, request } = require('express')
const express = require('express')
const serverless = require('serverless-http')
const cors = require('cors')
const router = express.Router()
const app = express()

require('dotenv').config()
const Person = require('./models/person')
app.use(cors())

app.use(express.json())

router.get('/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
    .catch(error => next(error))
})

router.get('/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if(!person) {
            return response.status(404).end()
        }
        response.json(person)
    })
    .catch(error => next(error))

})

const generateId = () => {
    let random = Math.ceil(Math.random() * 10000);
    let time = Date.now();
    const maxId = persons.length > 0
            ? Math.max(...persons.map(p => p.id))
            : 0

    return random + time + maxId;
}

router.get('/info', (request, response) => {
    let info = `Phonebook has info for people <br /><br />`;
    const date = new Date();
    info += ` ${date}`
    response.send(info)
})

router.delete('/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove( {_id: request.params.id}, function(err) {
        if(!err) {
            response.status(204).end()
        } else {
            response.status(500).end()
        }
    })
    .catch(error => next(error))
})

router.put('/persons/:id', (request, response, next) => {
    Person.findOneAndUpdate({_id: request.params.id}, request.body, {new: true}, (err, updatedPerson) => {
        if(err) return next(err)
        return response.send(updatedPerson)
    })
})

router.post('/persons', (request, response) => {
    const body = request.body;

    if(!body.name || !body.number) {
        return response.status(400).json(
            {error: 'content missing'}
        )
    }
    Person.find({}).then(persons => {
        if(persons.find(person => person.name === body.name)) {
            return response.status(400).json(
                {error: 'name must be unique'}
            )
        }
        const person = new Person({
            name: body.name,
            number: body.number,
          })
        
        person.save().then(savedPerson => {
            response.json(savedPerson)
        })
    })
    .catch(error => next(error))

})

app.use('/.netlify/functions/index', router)

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if(error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

module.exports.handler = serverless(app)