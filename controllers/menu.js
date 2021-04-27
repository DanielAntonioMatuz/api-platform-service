var Menu = require('../models/menuData');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function saveMenu(req,res){
    var params = req.body;
    console.log(params);
    var menu = new Menu();
    if(params.nombre && params.detalles){
        menu.nombre = params.nombre;
        menu.detalles = params.detalles;
        menu.precio = params.precio;
        menu.vigencia = params.vigencia;
        menu.empresa = params.empresa;
        menu.imagen = params.imagen;
        menu.anexos = params.anexos;
        menu.user = req.user.sub;


        Menu.find({
            $or: [
                {_id: menu._id}
            ]
        }).exec((err, menus) => {
            console.log(err);
            if(err) return res.status(500).send({message: 'Error en la peticion de Menu'});

            if(menus && menus.length >= 1){
                return res.status(200).send({message: 'El Menu que intenta registrar ya existe'})
            } else {

                    menu.save((err, userStored) => {
                        console.log(err);
                        if(err) return res.status(500).send({message: 'Error al guardar el menu'})

                        if(userStored){
                            res.status(200).send({user: userStored });
                        } else {
                            res.status(404).send({message: 'No se ha registrado el menu'})
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

function getMenus(req, res){
    Menu.find({user: req.user.sub},(err,menus)=> {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if(menus){
                res.status(200).send({menus: menus});
            } else {
                res.status(500).send({message: 'No existe ningun menu'});
            }
        }
    });

}

function getMenusPublic(req, res){
    console.log(req.params);
    Menu.find({user: req.params.user}, (err,menus)=> {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if(menus){
                res.status(200).send({menus: menus});
            } else {
                res.status(500).send({message: 'No existe ningun menu'});
            }
        }
    });

}

function getMenuId(req, res){
    Menu.find({_id: req.params.id},(err,menus)=> {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if(menus){
                res.status(200).send({menus: menus});
            } else {
                res.status(500).send({message: 'No existe ningun menu'});
            }
        }
    });

}

function deleteMenu(req, res){
    var menuId = req.params.id;

    Menu.find({'_id': menuId}).remove((err) => {
        if(err) return res.status(500).send({message: 'Error al borrar el menu'});

        //if(!publicationRemoved) return res.status(404).send({message: 'No se ha borrado la publicacion'})

        return res.status(200).send({message: 'Menu eliminado correctamente'});
    })
}

function updateMenu(req, res){
    var id = req.params['id'];
    var data = req.body;
    console.log(data);
    Menu.findByIdAndUpdate(id, {nombre: data.nombre, detalles: data.detalles , precio: data.precio
        ,vigencia: data.vigencia, empresa: data.empresa, imagen: data.imagen, anexos: data.anexos
    }, (err, menu_data)=>{
        if(menu_data){
            res.status(200).send({menu:menu_data});
        }
    });

}

function searchMenu(req, res){
    var params = req.body;
    Menu.find({nombre: { "$regex": "^" + req.body.nombre.nombre, $options:"i"}, user: req.body.id}, (err, menu) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});

        if(menu){
            return res.status(200).send({search: menu})
        } else {
            return res.status(404).send({message: 'El producto/servicio no se ha podido identifcar en el servidor'})
        }
    })
}


module.exports = {
    saveMenu,
    getMenus,
    deleteMenu,
    updateMenu,
    searchMenu,
    getMenuId,
    getMenusPublic
}
