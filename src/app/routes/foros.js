'use strict'

const Foro = require('../controllers/foros')

module.exports = api => {
    api.route('/api/foros')
        .post(Foro.create)
        .get(Foro.getAll)
    
    api.route('/api/foros/:id')
        .delete(Foro.delete)
        .put(Foro.update)
        .get(Foro.getById)
}