const appointment = require('../models/Appointment');
const AppointmentFactory = require  ('../factories/AppointmentFactory');
const mongoose= require('mongoose');
const mailer = require('nodemailer');

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
            return false;
        }
        
    }

    async findOneByEmailOrCpf(term){
        try{
            return await Appo.find().or([{'cpf': term}, {'email': term}]);     
        }catch(err){
            console.log(err);
            return false;
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

    async sendNotification(){
        try{
            let appos = await this.findAll(false);
            const transporter = mailer.createTransport({
                    host: 'smtp.mailtrap.io',
                    port: 2525,
                    auth: {
                        user: "your user here",
                        pass: "your passe here"
                    }
                })
            appos.forEach(async appo =>{
            let date = appo.start.getTime();
            let hour = 1000 * 60 * 60;
            let gap = date- Date.now();
            if(gap <= hour && !appo.notified){
                console.log(appo.title);
                console.log('mandando notificação');
                await Appo.findByIdAndUpdate({_id: appo.id}, { notified: true});
                transporter.sendMail({
                    from: 'sender email here',
                    to: 'destiny email here',
                    subject: 'Consulta está próxima',
                    text: 'Sua consulta acontecerá em breve, não se esqueça de comparecer ao consultório com atencedência, evite transtornos'

                }).then((message)=>{
                    console.log(message);
                }).catch(err=>{
                    console.log(err);
                    return false;
                })
            }
           });
        }catch(err){
            console.log(err);
            return false;
        }
    }
}

module.exports = new AppointmentService();