'use strict'

var express = require('express');
var UseController = require('../controllers/userCustomer');
var md_auth = require('../middlewares/authenticated');
var api = express.Router();


api.get('/home', UseController.home);
api.get('/pruebas', UseController.pruebas);
api.post('/register-customer', UseController.saveUserService);
api.post('/login', UseController.loginUser);
api.get('/usuario-customer/:id', md_auth.ensureAuth, UseController.get_userService);

module.exports = api;
