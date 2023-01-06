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

app.post('/appointment', (req, res)=>{
    const {name, email, description, cpf, date, time} = req.body;
    if(name && email && description && cpf && date && time){
        const result = appointmentService.create(name, email, description, cpf, date, time);
        if(result){
            res.status(201);
            res.render('create');
        }else{
            console.log('Ocorreu um erro ao salvar a consulta')
            res.render('create');
        }
    }else{
        res.json({allFieldsFilled: 'false'});
    
    }

});

app.get('/calendar', async (req, res)=>{
    let appointments = await appointmentService.findAll();
    res.send(appointments);
})


app.listen(8080, ()=>console.log('api running'));