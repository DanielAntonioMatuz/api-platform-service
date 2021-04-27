'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MenuDataSchema = Schema({
    nombre: String,
    detalles: String,
    precio: String,
    vigencia: String,
    empresa: String,
    imagen: String,
    anexos: String,
    user: {type: Schema.ObjectId, ref: 'User'}

})

module.exports = mongoose.model('Menu', MenuDataSchema);

