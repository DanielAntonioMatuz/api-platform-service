'use strict'

var express = require('express');
var empresaController = require('../controllers/empresaUser');
var md_auth = require('../middlewares/authenticated');
var api = express.Router();
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads/users'});

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});
var configMensaje = require('../services/configMensaje');

api.post('/register-empresa', md_auth.ensureAuth, empresaController.saveEmpresa);
api.get('/empresa/:user', md_auth.ensureAuth, empresaController.getEmpresa);
api.delete('/empresa-delete/:id', md_auth.ensureAuth, empresaController.deleteEmpresa);
api.put('/update-empresa/:id', md_auth.ensureAuth, empresaController.updateEmpresa);
api.get('/get-empresas', empresaController.getEmpresas);
api.get('/public-empresas/:id', empresaController.getEmpresaPublic);
api.get('/pagination-empresas/:page?', empresaController.getEmpresasPagination);




module.exports = api;
