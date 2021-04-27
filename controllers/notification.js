var Notification = require('../models/notifications');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var moment = require('moment');

function saveNotifications(req,res){
    var params = req.body;
    var notification = new Notification();
    if(params.nombre){
        notification.nombre = params.nombre;
        notification.detalles = params.detalles;
        notification.empresa = params.empresa;
        notification.fecha = moment().unix();
        notification.imagen = params.imagen;
        notification.anexos = params.anexos;
        notification.estatus = params.estatus;
        notification.user = params.user;

        Notification.find({
            $or: [
                {_id: notification._id}
            ]
        }).exec((err, notifications) => {
            if(err) return res.status(500).send({message: 'Error en la peticion de notificaciones'});

            if(notifications && notifications.length >= 1){
                return res.status(200).send({message: 'La notificacion que intenta registrar ya existe'})
            } else {


                notification.save((err, userStored) => {
                        if(err) return res.status(500).send({message: 'Error al guardar la notificacion'})

                        if(userStored){
                            res.status(200).send({user: userStored });
                        } else {
                            res.status(404).send({message: 'No se ha registrado la notificacion'})
                        }
                    });

            }
        })



    } else {
        res.status(200).send({
            message: "Envia todos los campos necesarios"
        });
    }
}

function get_notifications(req, res){
    Notification.find({user: req.user.sub}, (err,notifications)=> {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if(notifications){
                res.status(200).send({notifications: notifications});
            } else {
                res.status(500).send({message: 'No existe ninguna notificacion'});
            }
        }
    });

}

function deletePublication(req, res){
    var notificationId = req.params.id;

    Notification.find({'_id': notificationId}).remove((err) => {
        if(err) return res.status(500).send({message: 'Error al borrar la notificacion'});

        //if(!publicationRemoved) return res.status(404).send({message: 'No se ha borrado la publicacion'})

        return res.status(200).send({message: 'Notificacion eliminado correctamente'});
    })
}

function updateNotification(req, res){
    var id = req.params['id'];
    var data = req.body;
    console.log('IV');
    Notification.findByIdAndUpdate(id, {nombre: data.nombre, detalles: data.detalles , fecha: data.fecha
        ,empresa: data.empresa, imagen: data.imagen, anexos: data.anexos, estatus: data.estatus
    }, (err, notification_data)=>{
        console.log(notification_data);
        if(notification_data){
            res.status(200).send({notification:notification_data});
        }
    });

}


module.exports = {
    saveNotifications,
    get_notifications,
    deletePublication,
    updateNotification
}
