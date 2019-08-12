'use strict'

const Processo = require('../models/processos')
const mongoose = require('mongoose')

module.exports = {

    create: async (info) => {

        info._id = mongoose.Types.ObjectId()
        var processo = new Processo(info)
        console.log('Criar novo processo!!!', processo);
        
        try{
            var response;
            response = await processo.save()
            console.log(response)
            console.log({type: 'SUCCESS', message: response})
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
            var response = await Lot.find({}).exec()
            res.status(200).json({type: 'SUCCESS', message: response})

        }catch ( err ) {
            res.status(200).json({type: 'ERROR', message: response})
        }         
    },

    getById: async (req, res, next) => {
        const rId = req.params.id;
        
        try{
            var response = await Lot.findById(rId).exec()
            res.status(200).json({type: 'SUCCESS', message: response})

        }catch ( err ) {
            res.status(200).json({type: 'ERROR', message: response})
        }   
    },

    update: async(req, res, next) => {
        var rId = req.params.id
        var reqUpdate = req.body

        try {
            var response = await Lot.findByIdAndUpdate(rId, reqUpdate)
            res.status(200).json({type: 'SUCCESS', message: response, updated: true})
        } catch ( err ) {
            res.status(200).json({type: 'ERROR', message: response, updated: false})
        }
    }

}