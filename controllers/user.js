'use strict'
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var User = require('../models/user');
var Menu = require('../models/menuData');
var UserService =  require('../models/userService');
var Follow = require('../models/follow');
var Publication =require('../models/publication');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');
var moment = require('moment');

/*var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);




io.on('connection', function (socket) {
    console.log('User connected');
    socket.emit('new-data', 'user connected');

});


server.listen(3000, () => {
    console.log('service socket is active in port 3000');
})
*/
function socketService(data) {

}

function saveMenu(req,res){
    var params = req.body;
    var menu = new Menu();
    if(params.nombre && params.precio){
        menu.nombre = params.nombre;
        menu.detalles = params.detalles;
        menu.precio = params.precio;
        menu.vigencia = params.vigencia;
        menu.empresa = params.empresa;
        menu.imagen = params.imagen;
        menu.anexos = params.anexos;


        Menu.find({
            $or: [
                {nombre: menu.nombre.toLowerCase()},
                {_id: menu._id}
            ]
        }).exec((err, menus) => {
            if(err) return res.status(500).send({message: 'Error en la peticion de Menu'});

            if(menus && menus.length >= 1){
                return res.status(200).send({message: 'El Menu que intenta registrar ya existe'})
            } else {

                bcrypt.hash(params.password, null, null, (err, hash) => {
                    menu.password = hash;

                    menu.save((err, userStored) => {
                        if(err) return res.status(500).send({message: 'Error al guardar el menu'})

                        if(userStored){
                            res.status(200).send({user: userStored });
                        } else {
                            res.status(404).send({message: 'No se ha registrado el menu'})
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
function saveUser(req,res){
    var params = req.body;
    var user = new User();

    if(params.nombre && params.email && params._id){
        user.nombre = params.nombre;
        user.email = params.email;
        user.estadoPedido = params.estadoPedido;
        user.act1 = params.act1;
        user.act2 = params.act2;
        user.act3 = params.act3;
        user.act4 = params.act4;
        user.vigencia = null;
        user.fechaOrden = moment().unix();
        user.referencia = params.referencia;
        user._id = params._id;
        user.pedido = params.pedido;
        user.user = req.user.sub;

        User.find({
            $or: [
                {referencia: user.referencia.toLowerCase()},
                {_id: user._id.toLowerCase()}
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
        user.horario = params.horarios;

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

function get_user(req, res){
    let id = req.params['id'];

    User.findById(id, (err, user) => {
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

function get_users(req, res){
    let data;
    User.find({user: req.user.sub},(err,users)=> {
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

function getPublicationsUser(req, res){
    console.log('Empresas generales');
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    /*var user = req.user.sub;

    if(req.params.user){
        user = req.params.user;
    }*/

    var itemsPerPage = 7;

    UserService.find().sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
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

function searchUser(req, res){
    var params = req.body;
    User.find({nombre: { "$regex": "^" + req.body.email, $options:"i"}, user: req.user.sub}, (err, user) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});

        if(user){
            return res.status(200).send({search: user})
        } else {
            return res.status(404).send({message: 'El usuario no se ha podido identifcar en el servidor'})
        }
    })
}






module.exports = {
    home,
    pruebas,
    saveUser,
    get_user,
    updateUser,
    get_users,
    saveUserService,
    loginUser,
    editar_config,
    searchUser,
    get_userService,
    getUsersService,
    getPublicationsUser
}
