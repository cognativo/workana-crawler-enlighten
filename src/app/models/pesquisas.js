'use strict'

const db = require('../database/db')
const mongoose = require('mongoose')

const principalSchema = new mongoose.Schema({
    processo: String,
    classe : String,
    assunto: String,
    distribuicao: String,
    foro: String,
    controle: String,
    juiz: String,
    valorAcao: String
});

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

const pesquisaSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    urlPesquisa: String,
    codigoPesquisa: String,
    title: String,
    capaProcesso: [principalSchema],
    partes: [partesSchema],
    movimentacoes: [movimentacoesSchema]
});

const resultPesquisaSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    codigoPesquisa: String,
    urlPesquisa: String
})
 
var PesquisaModel = mongoose.model("pesquisas", pesquisaSchema);
 
module.exports = PesquisaModel;