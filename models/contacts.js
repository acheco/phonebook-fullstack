require('dotenv').config();
const mongoose = require('mongoose');

const BASE_URI = process.env.MONGODB_URI;

const url = BASE_URI;
mongoose.set('strictQuery', false);

mongoose.connect(url).then(() => {
    console.log('Connected to MONGODB');
}).catch(err => console.log('Error connecting to MONGO',err.message));

const phonebookSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
    },
    number: {
        type: String,
        validate: function (value) {
            return /^\d{3}-\d{3}-\d{4}$/.test(value);
        },
        message: props => `${props.value} Please, enter a valid phone number`,
        required: true,
    },
});

phonebookSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
    }
})

module.exports = mongoose.model('Contact', phonebookSchema);

