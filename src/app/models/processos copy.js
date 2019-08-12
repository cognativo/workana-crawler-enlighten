'use strict'

const db = require('../database/db')
const mongoose = require('mongoose')

const partesSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    tipo: String,
    responsavel: String
});

const movimentacoesSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    data: String,
    movimento: String
});

const processoSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    processo: String,
    ideclassentification : String,
    assunto: String,
    distribuicao: String,
    foro: String,
    controle: String,
    juiz: String,
    valorAcao: String,
    partes: [partesSchema],
    movimentacoes: [movimentacoesSchema]
});
 
var ProcessoModel = mongoose.model("pesquisas", processoSchema);
 
module.exports = ProcessoModel;