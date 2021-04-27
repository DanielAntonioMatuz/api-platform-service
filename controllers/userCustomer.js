'use strict'
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var Menu = require('../models/menuData');
var UserService =  require('../models/userCustomer');
var Follow = require('../models/follow');
var Publication =require('../models/publication');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');
var moment = require('moment');

//Métodos de pruebas
function home (req, res)  {
    res.status(200).send({
        message: 'Acción de pruebas en el servidor de NodeJS'
    });
}


function pruebas (req, res) {
    res.status(200).send({
        message: 'Acción de pruebas en el servidor de NodeJS'
    });
}


//Registro de Usuario
function saveUserService(req,res){
    var params = req.body;
    var user = new UserService();
    console.log(user);
    if(params.name && params.surname && params.email && params.password){
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.image = null;
        user.cellphone = params.cellphone;
        user.estatus = 'true';
        user.direction = params.direction;

        UserService.find({
            $or: [
                {email: user.email.toLowerCase()},
            ]
        }).exec((err, users) => {
            if(err) return res.status(500).send({message: 'Error en la peticion de usuarios'});

            if(users && users.length >= 1){
                return res.status(200).send({message: 'El usuario que intenta registrar ya existe'})
            } else {
                //Cifrar contrasena
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;

                    user.save((err, userStored) => {
                        if(err) return res.status(500).send({message: 'Error al guardar el usuario'})

                        if(userStored){
                            res.status(200).send({user: userStored });
                        } else {
                            res.status(404).send({message: 'No se ha registrado el usuario'})
                        }
                    });
                });

            }
        })


    } else {
        res.status(200).send({
            message: "Envia todos los campos necesarios"
        });
    }
}


//Loging Usuario
function loginUser(req, res){
    var params = req.body;

    var email = params.email;
    var password = params.password;

    UserService.findOne({email: email}, (err, user) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});

        if(user){
            bcrypt.compare(password, user.password, (err, check) => {
                if(check){
                    if(params.gettoken){
                        //devolver y Generar token
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    } else {
                        //devolver datos del usuario
                        user.password = undefined;

                        return res.status(200).send({user})
                    }

                } else {
                    return res.status(404).send({message: 'El usuario no se ha podido identificar'});
                }
            });
        } else {
            return res.status(404).send({message: 'El usuario no se ha podido identifcar en el servidor'})
        }
    })

}

//Actualizar los datos del usuario
/*
function updateUser(req, res) {
    const id = req.params.id;
    const data = req.body;
    console.log(data.estado);

    console.log('IV');
    User.findByIdAndUpdate(id, {
        estadoPedido: data.estadoPedido,
        act1: data.act1,
        act2: data.act2,
        act3: data.act3,
        act4: data.act4,
        vigencia: data.vigencia,
        fechaOrden: data.fechaOrden,
        email: data.email,
        nombre: data.nombre,
        producto: data.producto
    }, (err, user_data) => {
        if (user_data) {
            res.status(200).send({user: user_data});
        }
    });

}

*/

/*
function editar_config(req, res){
    var id = req.params['id'];
    var data = req.body;
    console.log(data);
    console.log('IV');
    User.findByIdAndUpdate(id, {nombre: data.nombre, email: data.email , estadoPedido: data.estadoPedido
        ,act1: data.act1, act2: data.act2, act3: data.act3, act4: data.act4, vigencia: data.vigencia, fechaOrden: data.fechaOrden,
        referencia: data.referencia, pedido: data.pedido
    }, (err, user_data)=>{
        console.log(err);
        if(user_data){
            res.status(200).send({user:user_data});
        }
    });

}
*/



function get_userService(req, res){
    let id = req.params['id'];
    UserService.findById(id, (err, user) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if(user){
                res.status(200).send({user:user});
            } else {
                res.status(500).send({message:'No existe un usuario con ese ID'});
            }
        }
    })
}


/*
function getUsersService(req, res){
    let data;
    UserService.find((err,users)=> {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if(users){
                res.status(200).send({users: users});
            } else {
                res.status(500).send({message: 'No existe ningun usuario'});
            }
        }
    });

}

*/

module.exports = {
    home,
    pruebas,
    saveUserService,
    loginUser,
    get_userService,
}
