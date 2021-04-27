'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    _id: String,
    nombre: String,
    email: String,
    estadoPedido: String,
    act1: String,
    act2: String,
    act3: String,
    act4: String,
    vigencia: String,
    fechaOrden: String,
    referencia: String,
    pedido: String,
    user: {type: Schema.ObjectId, ref: 'User'}



})

module.exports = mongoose.model('User', UserSchema);

