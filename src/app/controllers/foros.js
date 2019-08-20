'use strict'

const Foro = require('../models/foros')
const mongoose = require('mongoose')

module.exports = {

    create: async (info) => {

        info._id = mongoose.Types.ObjectId()
        var foro = new Foro(info)
        console.log('Criar novo foro!!!', foro);
        
        try{
            var response;
            response = await foro.save()
            console.log(response)
            console.log({type: 'SUCCESS', data: response})
        }catch( error ) {
            console.log(error);
            
        }

    },

    delete: async (req, res, next) => {

        const rid = req.params.id;
        
        try{
            var lotRef = await Lot.findById(rid).exec()
            var response = await lotRef.remove()
            
            res.status(200).json({type: 'SUCCESS', data: response, deleted: true})

        }catch ( err ){
            res.status(200).json({type: 'ERROR', data: response, deleted: false})
        }
    },

    getAll: async(req, res, next) => {
        
        try{
            var response = await Foro.find({}).exec()
            res.status(200).json({type: 'SUCCESS', data: response})

        }catch ( err ) {
            res.status(200).json({type: 'ERROR', data: response})
        }         
    },

    getById: async (req, res, next) => {
        const rId = req.params.id;
        
        try{
            var response = await Foro.findById(rId).exec()
            res.status(200).json({type: 'SUCESSO', data: response})

        }catch ( err ) {
            res.status(200).json({type: 'ERROR', data: response})
        }   
    },

    update: async(req, res, next) => {
        var rId = req.params.id
        var reqUpdate = req.body

        try {
            var response = await Foro.findByIdAndUpdate(rId, reqUpdate)
            res.status(200).json({type: 'SUCCESS', data: response, updated: true})
        } catch ( err ) {
            res.status(200).json({type: 'ERROR', data: response, updated: false})
        }
    }

}