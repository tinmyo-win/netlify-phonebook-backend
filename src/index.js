const { response } = require('express')
const express = require('express')
const serverless = require('serverless-http')
const router = express.Router()
const app = express()

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())

router.get('/persons', (request, response) => {
    response.json(persons)
})

router.get('/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if(person){
        response.json(person)
    } else{
        response.status(404).end()
    }

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
    let info = `Phonebook has info for ${persons.length} people <br /><br />`;
    const date = new Date();
    info += ` ${date}`
    response.send(info)
})

router.delete('/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

router.post('/persons', (request, response) => {
    const body = request.body;

    if(!body.name || !body.number) {
        return response.status(400).json(
            {error: 'content missing'}
        )
    }

    if(persons.find(person => person.name === body.name)) {
        return response.status(400).json(
            {error: 'name must be unique'}
        )
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
})

app.use('/.netlify/functions/index', router)

module.exports.handler = serverless(app)