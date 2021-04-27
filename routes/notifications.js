'use strict'

var express = require('express');
var NotificationController = require('../controllers/notification');
var md_auth = require('../middlewares/authenticated');
var api = express.Router();
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads/users'});

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});
var configMensaje = require('../services/configMensaje');

api.post('/register-notifications', md_auth.ensureAuth, NotificationController.saveNotifications);
api.get('/notifications/:user', md_auth.ensureAuth, NotificationController.get_notifications);
api.delete('/notifications-delete/:id', md_auth.ensureAuth, NotificationController.deletePublication);
api.put('/update-notifications/:id', md_auth.ensureAuth, NotificationController.updateNotification);



module.exports = api;
