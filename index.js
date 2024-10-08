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
app.get('/api/persons/:id', (req, res, next) => {

    Contact.findById(req.params.id)
        .then((contact) => {
            if (contact) {
                res.json(contact);
            } else {
                res.status(404).send('Not Found');
            }
        })
        .catch(error => {
            next(error);
        })
});

// DELETE a contact
app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;

    Contact.deleteOne({_id: id})
        .then((contact) => {
            res.status(204).end();
        })
        .catch(error => {
            next(error);
        })
})

// POST a new contact
app.post('/api/persons', (req, res, next) => {
    const body = req.body;

    const contact = new Contact({
        name: body.name,
        number: body.number,
    });

    contact.save()
        .then((result) => {
            res.json(result)
        })
        .catch(error => next(error));

});

app.put('/api/persons/:id', (req, res, next) => {
    const {name, number} = req.body;

    Contact.findByIdAndUpdate(
        req.params.id,
        {name, number},
        {new: true, runValidators: true, context: 'query'}
    )
        .then((updatedContact) => {
            res.json(updatedContact);
        })
        .catch(error => {
            next(error);
        })
})

// Middleware para endpoint desconocidos
const unknownEndPoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'});
}

app.use(unknownEndPoint);

// Middleware para manejo de errores
const errorHandler = (err, req, res, next) => {
    console.error(err.message);

    if (err.name === 'CastError') {
        return res.status(400).send({error: 'Incorrect ID format'})
    }

    if (err.name === 'ValidationError') {
        return res.status(400).send({error: err.message});
    }

    next(err);
}

app.use(errorHandler);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

