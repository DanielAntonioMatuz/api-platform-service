'use strict'

var express = require('express');
var SettingsController = require('../controllers/settings');
var md_auth = require('../middlewares/authenticated');
var api = express.Router();
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads/users'});

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});
var configMensaje = require('../services/configMensaje');

api.post('/register-settings', md_auth.ensureAuth, SettingsController.saveSettings);
api.get('/settings/:user', md_auth.ensureAuth, SettingsController.getSettings);
api.delete('/settings-delete/:id', md_auth.ensureAuth, SettingsController.deleteSettings);
api.put('/update-settings/:id', md_auth.ensureAuth, SettingsController.updateSettings);




module.exports = api;
