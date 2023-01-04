const appointment = require('../models/Appointment');
const mongoose= require('mongoose');

const Appo = mongoose.model('Appointment', appointment);

class AppointmentService{
    
    async create(name, email, description, cpf, date, time){
        const newAppo = new Appo({
            name,
            email,
            description,
            cpf,
            date, 
            time
        });

        try{
            await newAppo.save();
            return true;
        }catch(err){
            console.log(err);
            return false;
        }
    }   
}

module.exports = new AppointmentService();