'use strict'

var express = require('express');
var MenuController = require('../controllers/menu');
var md_auth = require('../middlewares/authenticated');
var api = express.Router();
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads/users'});

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});
var configMensaje = require('../services/configMensaje');

api.post('/register-menu', md_auth.ensureAuth, MenuController.saveMenu);
api.get('/menu/:user', md_auth.ensureAuth, MenuController.getMenus);
api.get('/menu-public/:user', MenuController.getMenusPublic);
api.post('/search-menu', MenuController.searchMenu);
api.put('/update-menu/:id', md_auth.ensureAuth, MenuController.updateMenu);
api.delete('/delete-menu/:id', md_auth.ensureAuth, MenuController.deleteMenu);
api.get('/id-menu/:id', MenuController.getMenuId);



module.exports = api;

