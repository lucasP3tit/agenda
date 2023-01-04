const mongoose = require('mongoose');

const appointment = new mongoose.Schema({
    name: String,
    email: String,
    description: String,
    cpf: String,
    date: Date,
    time: String,
    fineshed: Boolean
});

module.exports = appointment;