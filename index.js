require('dotenv').config();
const Contact = require('./models/contacts');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

morgan.token('body', req => {
    return JSON.stringify(req.body);
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan(':method :url :status :body :res[content-length] '));
app.use(express.static('dist'));
app.use(cors());

// const randomId = function (length = 6) {
//     return Math.random().toString(36).substring(2, length + 2);
// };

// GET all contacts
app.get('/api/persons', (req, res) => {
    Contact.find({}).then((contacts) => {
        res.json(contacts);
    });
});

// GET general info about the Phonebook
app.get('/info', (req, res) => {
    const date = new Date();
    res.send(`<p>Phonebook has info for ${persons.length} people</p> <br/> <p>${date}</p>`);
});

// GET a single contact
app.get('/api/persons/:id', (req, res) => {

    Contact.findById(req.params.id)
        .then((contact) => {
            if (contact) {
                res.json(contact);
            } else {
                res.status(404).send('Not Found');
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).end();
        })

});

// DELETE a contact
app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;

    Contact.deleteOne({_id: id})
        .then((contact) => {
            res.status(204).end();
        });

})

// POST a new contact
app.post('/api/persons', (req, res) => {
    const body = req.body;

    // const personExist = persons.find((person) => person.name === body.name);

    if (body.name === undefined || body.name === '') {
        return res.status(400).json(
            {
                error: 'Name is required'
            });
    }

    if (body.number === undefined || body.number === '') {
        return res.status(400).json(
            {
                error: 'Number is required'
            }
        )
    }

    // if (personExist) {
    //     return res.status(400).json(
    //         {
    //             error: 'Name must be unique'
    //         }
    //     )
    // }

    const contact = new Contact({
        name: body.name,
        number: body.number,
    });

    contact.save().then((result) => {
        res.json(result)
    })

});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

