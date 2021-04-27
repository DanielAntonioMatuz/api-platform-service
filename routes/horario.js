'use strict'

var express = require('express');
var HorarioController = require('../controllers/horarios');
var md_auth = require('../middlewares/authenticated');
var api = express.Router();
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads/users'});

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});
var configMensaje = require('../services/configMensaje');

api.post('/register-horario', md_auth.ensureAuth, HorarioController.saveHorarios);
api.get('/horario/:user', md_auth.ensureAuth, HorarioController.getHorarios);
api.put('/update-horario/:id', md_auth.ensureAuth, HorarioController.updateHorarios);
api.delete('/delete-horario/:id', md_auth.ensureAuth, HorarioController.deleteHorarios);
api.get('/horario-global', md_auth.ensureAuth, HorarioController.getHorariosGlobal);



module.exports = api;
