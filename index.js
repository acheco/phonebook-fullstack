import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

morgan.token('body', req => {
    return  JSON.stringify(req.body);
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(':method :url :status :body :res[content-length] '));
app.use(express.static('dist'));
app.use(cors());

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
];

const randomId = function (length = 6) {
    return Math.random().toString(36).substring(2, length + 2);
};

// GET all contacts
app.get('/api/persons', (req, res) => {
    res.json(persons);
});

// GET general info about the Phonebook
app.get('/info', (req, res) => {
    const date = new Date();
    res.send(`<p>Phonebook has info for ${persons.length} people</p> <br/> <p>${date}</p>`);
});

// GET a single contact
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find((person) => person.id === id);

    if (!person) {
        res.status(404).send('No such person');
    }

    res.json(person);

});

// DELETE a contact
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find((person) => person.id === id);
    if (!person) {
        res.status(404).send('No such person');
    }
    res.status(204).end();
})

// POST a new contact
app.post('/api/persons', (req, res) => {
    const body = req.body;

    const personExist = persons.find((person) => person.name === body.name);

    if (!body.name) {
        return res.status(400).json(
            {
                error: 'Name is required'
            });
    }

    if (!body.number) {
        return res.status(400).json(
            {
                error: 'Number is required'
            }
        )
    }

    if (personExist) {
        return res.status(400).json(
            {
                error: 'Name must be unique'
            }
        )
    }

    const person = {
        "id": randomId(),
        "name": body.name,
        "number": body.number,
    }

    persons = persons.concat(...persons, person);
    res.json(person);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

