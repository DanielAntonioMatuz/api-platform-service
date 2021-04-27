'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotificationSchemma = Schema({
    nombre: String,
    detalles: String,
    empresa: String,
    fecha: String,
    imagen: String,
    anexos: String,
    estatus: String,
    user: {type: Schema.ObjectId, ref: 'User'}

})

module.exports = mongoose.model('Notification', NotificationSchemma);

