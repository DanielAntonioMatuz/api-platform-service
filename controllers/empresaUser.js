'use strict'
var Empresa = require('../models/empresaUser');
var moment = require('moment');

function saveEmpresa(req,res){
    var params = req.body;
    var datosEmpresa = new Empresa();
    if(params.user){
        datosEmpresa.imagen = params.imagen;
        datosEmpresa.categoria = params.categoria;
        datosEmpresa.nombre = params.nombre;
        datosEmpresa.descripcion = params.descripcion;
        datosEmpresa.direccion = params.direccion;
        datosEmpresa.user = params.user;

        Empresa.find({
            $or: [
                {_id: datosEmpresa._id},
                {nombre: datosEmpresa.nombre}
            ]
        }).exec((err, empresaData) => {
            console.log(err);
            if(err) return res.status(500).send({message: 'Error en la peticion de configuraciones'});

            if(empresaData && empresaData.length >= 1){
                console.log(err);
                return res.status(200).send({message: 'La configuracion que intenta registrar ya existe'})
            } else {


                datosEmpresa.save((err, userStored) => {
                    console.log(err);
                    if(err) return res.status(500).send({message: 'Error al guardar la configuracion'})

                    if(userStored){
                        res.status(200).send({empresa: userStored });
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

function getEmpresa(req, res){
    console.log('ID SETTINGS' + req.user);
    Empresa.find({user: req.user.sub},(err,settings)=> {
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

function getEmpresas(req, res){
    Empresa.find((err,users)=> {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if(users){
                res.status(200).send({users: users});
            } else {
                res.status(500).send({message: 'No existe ninguna empresa'});
            }
        }
    });

}

function deleteEmpresa(req, res){
    var empresaId = req.params.id;

    Empresa.find({'_id': empresaId}).remove((err) => {
        if(err) return res.status(500).send({message: 'Error al borrar la notificacion'});

        //if(!publicationRemoved) return res.status(404).send({message: 'No se ha borrado la publicacion'})

        return res.status(200).send({message: 'Empresa eliminado correctamente'});
    })
}

function updateEmpresa(req, res){
    var id = req.params['id'];
    var data = req.body;
    console.log('IV');
    Empresa.findByIdAndUpdate(id, {navbarColor: data.navbarColor, textColor: data.textColor , notificationColor: data.notificationColor
        ,fecha: data.fecha, logo: data.logo, logoText: data.logoText, styleLogo: data.styleLogo, user: data.user
    }, (err, settings_data)=>{
        if(settings_data){
            res.status(200).send({settings:settings_data});
        }
    });

}

function getEmpresaPublic(req, res){
    console.log(req.params);
    Empresa.find({user: req.params.id}, (err,empresa)=> {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if(empresa){
                res.status(200).send({empresa: empresa});
            } else {
                res.status(500).send({message: 'No existe ninguna empresa'});
            }
        }
    });

}

function getEmpresasPagination(req, res){
    console.log('Empresas generales');
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 7;

    Empresa.find().sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
        if(err) return res.status(500).send({message: 'Error devolver publicaciones'});

        if(!publications) return res.status(404).send({message: 'No hay publicaciones'});
        return res.status(200).send({
            total_items: total,
            pages: Math.ceil(total/itemsPerPage),
            page: page,
            items_per_page: itemsPerPage,
            publications
        });
    });
}


module.exports = {
    saveEmpresa,
    getEmpresa,
    deleteEmpresa,
    updateEmpresa,
    getEmpresas,
    getEmpresaPublic,
    getEmpresasPagination
}
