'use strict'
var Horarios = require('../models/horarios');
var moment = require('moment');

function saveHorarios(req,res){
    var params = req.body;
    var horario = new Horarios();
    console.log(params);
    if(req.user.sub){
        horario.domingoAbre = params.domingoAbre;
        horario.domingoCierra = params.domingoCierra;
        horario.lunesAbre = params.lunesAbre;
        horario.lunesCierra = params.lunesCierra;
        horario.martesAbre = params.martesAbre;
        horario.martesCierra = params.martesCierra;
        horario.miercolesAbre = params.miercolesAbre;
        horario.miercolesCierra = params.miercolesCierra;
        horario.juevesAbre = params.juevesAbre;
        horario.juevesCierra = params.juevesCierra;
        horario.viernesAbre = params.viernesAbre;
        horario.viernesCierra = params.viernesCierra;
        horario.sabadoAbre = params.sabadoAbre;
        horario.sabadoCierra = params.sabadoCierra;
        horario.user = params.user;

        Horarios.find({
            $or: [
                {_id: horario._id},
                {user: horario.user}
            ]
        }).exec((err, horarioData) => {
            console.log(err);
            if(err) return res.status(500).send({message: 'Error en la peticion de horarios'});

            if(horarioData && horarioData.length >= 1){
                console.log(err);
                return res.status(200).send({message: 'La configuracion que intenta registrar ya existe'})
            } else {


                horario.save((err, horarioStored) => {
                    console.log(err);
                    if(err) return res.status(500).send({message: 'Error al guardar el horario'})

                    if(horarioStored){
                        res.status(200).send({horario: horarioStored });
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

function getHorarios(req, res){
    console.log('ID HORARIO' + req.user);
    Horarios.find({user: req.user.sub},(err,horarios)=> {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if(horarios){
                res.status(200).send({horario: horarios});
            } else {
                res.status(500).send({message: 'No existe ninguna notificacion'});
            }
        }
    });

}

function getHorariosGlobal(req, res){
    Horarios.find((err,horarios)=> {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if(horarios){
                res.status(200).send({horarios: horarios});
            } else {
                res.status(500).send({message: 'No existe ninguna notificacion'});
            }
        }
    });

}

function deleteHorarios(req, res){
    var horarioId = req.params.id;

    Horarios.find({'_id': horarioId}).remove((err) => {
        if(err) return res.status(500).send({message: 'Error al borrar el horario'});

        //if(!publicationRemoved) return res.status(404).send({message: 'No se ha borrado la publicacion'})

        return res.status(200).send({message: 'Horario eliminado correctamente'});
    })
}

function updateHorarios(req, res){
    var id = req.params['id'];
    var data = req.body;
    console.log(data._id);
    console.log('IV');
    Horarios.findByIdAndUpdate(data._id, {domingoAbre: data.domingoAbre, domingoCierra: data.domingoCierra , lunesAbre: data.lunesAbre
        ,lunesCierra: data.lunesCierra, martesAbre: data.martesAbre, martesCierra: data.martesCierra, miercolesAbre: data.miercolesAbre, miercolesCierra: data.miercolesCierra ,
        user: data.user, juevesAbre: data.juevesAbre, juevesCierra: data.juevesCierra, viernesAbre: data.viernesAbre, viernesCierra: data.viernesCierra, sabadoAbre: data.sabadoAbre,
        sabadoCierra: data.sabadoCierra
    }, (err, horarioData)=>{
        if(horarioData){
            res.status(200).send({horario:horarioData});
        }
    });

}


module.exports = {
    saveHorarios,
    getHorarios,
    deleteHorarios,
    updateHorarios,
    getHorariosGlobal
}
