class AppointmentFactory{

    Build(simpleAppointment){
        
        let day = simpleAppointment.date.getDate()+ 1;
        let month = simpleAppointment.date.getMonth();
        let  year = simpleAppointment.date.getFullYear();
        let time = simpleAppointment.time.split(':');
        let hour = parseInt(time[0]) -3;
        let minute = parseInt(time[1]);
        let formatDate = new Date(year, month, day, hour, minute, 0, 0);

        let appo = {
            id: simpleAppointment.id,
            title: simpleAppointment.name + ' ' + simpleAppointment.description,
            start: formatDate,
            end: formatDate
        }
        
        return appo;
    }
}

module.exports = new AppointmentFactory();