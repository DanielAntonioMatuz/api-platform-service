'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmpresaUser = Schema({
    imagen: String,
    categoria: String,
    nombre: String,
    descripcion: String,
    direccion: String,
    user: {type: Schema.ObjectId, ref: 'UserService'}

});

module.exports = mongoose.model('Empresa', EmpresaUser);

