'use strict'
var Settings = require('../models/settings');
var moment = require('moment');

function saveSettings(req,res){
    var params = req.body;
    var settings = new Settings();
    if(params.user){
        settings.navbarColor = params.navbarColor;
        settings.textColor = params.textColor;
        settings.notificationColor = params.notificationColor;
        settings.fecha = moment().unix();
        settings.logo = params.logo;
        settings.logoText = params.logoText;
        settings.styleLogo = params.styleLogo;
        settings.user = params.user;

        Settings.find({
            $or: [
                {_id: settings._id}
            ]
        }).exec((err, settingsData) => {
            console.log(err);
            if(err) return res.status(500).send({message: 'Error en la peticion de configuraciones'});

            if(settingsData && settingsData.length >= 1){
                console.log(err);
                return res.status(200).send({message: 'La configuracion que intenta registrar ya existe'})
            } else {


                settings.save((err, userStored) => {
                    console.log(err);
                    if(err) return res.status(500).send({message: 'Error al guardar la configuracion'})

                    if(userStored){
                        res.status(200).send({user: userStored });
                    } else {
                        res.status(404).send({message: 'No se ha registrado las configuraciones'})
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

function getSettings(req, res){
    console.log('ID SETTINGS' + req.user);
    Settings.find({user: req.user.sub},(err,settings)=> {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if(settings){
                res.status(200).send({settings: settings});
            } else {
                res.status(500).send({message: 'No existe ninguna notificacion'});
            }
        }
    });

}

function deleteSettings(req, res){
    var settingsId = req.params.id;

    Settings.find({'_id': settingsId}).remove((err) => {
        if(err) return res.status(500).send({message: 'Error al borrar la notificacion'});

        //if(!publicationRemoved) return res.status(404).send({message: 'No se ha borrado la publicacion'})

        return res.status(200).send({message: 'Notificacion eliminado correctamente'});
    })
}

function updateSettings(req, res){
    var id = req.params['id'];
    var data = req.body;
    console.log('IV');
    Settings.findByIdAndUpdate(id, {navbarColor: data.navbarColor, textColor: data.textColor , notificationColor: data.notificationColor
        ,fecha: data.fecha, logo: data.logo, logoText: data.logoText, styleLogo: data.styleLogo, user: data.user
    }, (err, settings_data)=>{
        if(settings_data){
            res.status(200).send({settings:settings_data});
        }
    });

}


module.exports = {
    saveSettings,
    getSettings,
    deleteSettings,
    updateSettings
}
