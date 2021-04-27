'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SettingsSchema = Schema({
    navbarColor: String,
    textColor: String,
    notificationColor: String,
    fecha: String,
    logo: String,
    logoText: String,
    styleLogo: String,
    user: {type: Schema.ObjectId, ref: 'User'}

})

module.exports = mongoose.model('Settings', SettingsSchema);

