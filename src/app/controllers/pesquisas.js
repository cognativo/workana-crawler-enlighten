'use strict'

const Pesquisa = require('../models/pesquisas')
const mongoose = require('mongoose')

module.exports = {

    create: async (info) => {

        info._id = mongoose.Types.ObjectId()
        var pesquisa = new Pesquisa(info)
        
        try{
            var response;
            response = await pesquisa.save()
        }catch( error ) {
            console.log(error);
            
        }

    },

    delete: async (req, res, next) => {

        const rid = req.params.id;
        
        try{
            var lotRef = await Lot.findById(rid).exec()
            var response = await lotRef.remove()
            
            res.status(200).json({type: 'SUCCESS', message: response, deleted: true})

        }catch ( err ){
            res.status(200).json({type: 'ERROR', message: response, deleted: false})
        }
    },

    getAll: async(req, res, next) => {
        
        try{
            var response = await Pesquisa.find({}).exec()
            res.status(200).json({type: 'SUCCESS', data: response})

        }catch ( err ) {
            res.status(200).json({type: 'ERROR', data: response})
        }         
    },

    getResultados: async(req, res, next) => {
        
        try{
            var response = await Resultado.find({}).exec()
            res.status(200).json({type: 'SUCCESS', data: response})

        }catch ( err ) {
            res.status(200).json({type: 'ERROR', data: 'err'})
        }         
    },

    getById: async (req, res, next) => {
        const codPesquisa = req.params.codPesquisa;
        
        try{
            var response = await Pesquisa.find({codigoPesquisa: codPesquisa}).exec()
            res.status(200).json({type: 'SUCCESS', data: response})

        }catch ( err ) {
            res.status(200).json({type: 'ERROR', data: response})
        }   
    },

    update: async(req, res, next) => {
        var rId = req.params.id
        var reqUpdate = req.body

        try {
            var response = await Pesquisa.findByIdAndUpdate(rId, reqUpdate)
            res.status(200).json({type: 'SUCCESS', message: response, updated: true})
        } catch ( err ) {
            res.status(200).json({type: 'ERROR', message: response, updated: false})
        }
    }

}