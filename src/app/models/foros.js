'use strict'

const db = require('../database/db')
const mongoose = require('mongoose')

const foroSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    code: String,
    foro: String
});

var ForoModel = mongoose.model("foros", foroSchema);
 
module.exports = ForoModel;