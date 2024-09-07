import mongoose from "mongoose";

if(process.argv < 5 && process.argv.length > 3) {
    process.exit(1);
}

if(process.argv.length < 3) {
    process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const phoneNumber = process.argv[4];

const url = `mongodb+srv://admin:${password}@cluster0.489ei.mongodb.net/?retryWrites=true&w=majority`;
mongoose.set('strictQuery', false);

mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String,
});

const Phonebook = mongoose.model('Phonebook', phonebookSchema);

const contact = new Phonebook({
    name: name,
    phoneNumber: phoneNumber,
});

if (process.argv.length === 5) {
    contact.save().then( ({name, phoneNumber}) => {
        console.log(`Added ${name} number ${phoneNumber} to phonebook`);
        mongoose.connection.close();
    })
}

if(process.argv.length === 3) {
    Phonebook.find({}).then( (contacts) => {
        console.log('Phonebook: ')
        contacts.forEach((contact) => {
            console.log(contact.name, contact.phoneNumber);
        })
        mongoose.connection.close();
    })
}

