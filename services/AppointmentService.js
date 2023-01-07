const appointment = require('../models/Appointment');
const AppointmentFactory = require  ('../factories/AppointmentFactory');
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
    
    async findAll(showFinished){

        if(showFinished){
            try{
                return await Appo.find();
            }catch(err){
                console.log(err);
                return false;
            }    
        }else{
            try{
                let appointments = await Appo.find({'finished':false});
                let appos =[];
                appointments.forEach(appointment =>{
                    if(appointment.date){
                        let appointmentBuild = AppointmentFactory.Build(appointment);
                        appos.push(appointmentBuild);
                    }
                });
                return appos;
            }catch(err){
                console.log(err);
                return false;
            }
        }

    }

    async findOneById(id){
        try{
            return await Appo.findById(id);
        }catch(err){
            console.log(err);
            return err;
        }
        
    }

    async closeAppointment(id){
        try{
            await Appo.findOneAndUpdate({_id: id},{finished:true});
            return true;
        }catch(err){
            console.log(err);
            return false;
        }
    }
}

module.exports = new AppointmentService();