'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HorariosSchema = Schema({
    domingoAbre: String,
    domingoCierra: String,
    lunesAbre: String,
    lunesCierra: String,
    martesAbre: String,
    martesCierra: String,
    miercolesAbre: String,
    miercolesCierra: String,
    juevesAbre: String,
    juevesCierra: String,
    viernesAbre: String,
    viernesCierra: String,
    sabadoAbre: String,
    sabadoCierra: String,
    user: {type: Schema.ObjectId, ref: 'User'}
})

module.exports = mongoose.model('Horarios', HorariosSchema);

