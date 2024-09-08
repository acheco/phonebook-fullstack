require('dotenv').config();
const mongoose = require('mongoose');

const BASE_URI = process.env.MONGODB_URI;

const url = BASE_URI;
mongoose.set('strictQuery', false);

mongoose.connect(url).then(() => {
    console.log('Connected to MONGODB');
}).catch(err => console.log('Error connecting to MONGO',err.message));

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
});

phonebookSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
    }
})

module.exports = mongoose.model('Contact', phonebookSchema);

