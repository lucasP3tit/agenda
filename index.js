const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const appointmentService = require('./services/AppointmentService');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/agenda');

app.get('/', (req, res)=>{
    res.render('index')
});

app.get('/register', (req, res)=>{
    res.render('create');
});

app.get('/appointment/:id', async (req, res)=>{
    let id = req.params.id;
    let appo = await appointmentService.findOneById(id);
    res.render('view', { appo: appo});
})
app.post('/appointment', (req, res)=>{
    const {name, email, description, cpf, date, time} = req.body;
    if(name && email && description && cpf && date && time){
        const result = appointmentService.create(name, email, description, cpf, date, time);
        if(result){
            res.status(201);
            res.render('index');
        }else{
            console.log('Ocorreu um erro ao salvar a consulta')
            res.render('index');
        }
    }else{
        res.json({allFieldsFilled: 'false'});
    
    }

});

app.post('/close', async (req, res)=>{
    let id = req.body.id;
    let result = await appointmentService.closeAppointment(id);
    res.redirect("/")
})

app.get('/calendar', async (req, res)=>{
    let appointments = await appointmentService.findAll(false);
    res.send(appointments);
});

app.get('/list', async (req, res)=>{
    let appos = await appointmentService.findAll(true);
    res.render('list', {appos})
});

app.post('/search', async(req, res)=>{
    let term = req.body.search;
    let appos = await appointmentService.findOneByEmailOrCpf(term);
    if(appos){
        res.render('list', { appos });
    }
    res.redirect("/list");
});

setInterval(async()=>{
    await appointmentService.sendNotification();
}, 500000);

app.listen(8080, ()=>console.log('api running'));