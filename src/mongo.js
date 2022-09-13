const mongoose = require('mongoose')

let name = number = null;

const password = encodeURIComponent(process.argv[2]);

const url = `mongodb+srv://tinmyowin:${password}@cluster0.xm6fwxu.mongodb.net/?retryWrites=true&w=majority`

const personShema = new mongoose.Schema({
    name: String,
    number: Number,
})

const Person = mongoose.model('Person', personShema)

if (process.argv.length < 3 ) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
} else if (process.argv.length === 4 || process.argv.length > 5 ) {
    console.log('Usage:node mongo.js <pass> <name> <number>')
    console.log('')
    console.log('to fetch data: node mongo.js <pass>')
    console.log('FYI: Name should use double quotes like this "Arto Hell" if it has white space')
    process.exit(1);
}
if(process.argv.length === 5) {
    name = process.argv[3]
    number = process.argv[4]

    mongoose
    .connect(url)
    .then((result) => {
        console.log('connected')
        const person = new Person({
            name,
            number
        })

        return person.save()
    })
    .then(()=> {
        console.log(`Added ${name} number ${number} to phonebook`)
        return mongoose.connection.close()
    })
    .catch(err => {
        console.log(err)
    })
}

if(process.argv.length === 3) {
    mongoose
    .connect(url)
    .then((result) => {
        console.log('connected')
    })
    .catch(err => {
        if(err.code === 8000) {
            console.log('Incorrect Password try again')
            process.exit(1);
        }
    })
    Person.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(person => {
            console.log(person.name +' ' + person.number.toString())
        })
        mongoose.connection.close()
    })
}