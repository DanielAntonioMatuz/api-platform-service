'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserCustomerSchema = Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    image: String,
    cellphone: String,
    nick: String,
    direction: String,
    estatus: String
});

module.exports = mongoose.model('UserCustomerService', UserCustomerSchema);

