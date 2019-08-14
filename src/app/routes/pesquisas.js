'use strict'

const crawler = require('../services/pesquisas')
const controller = require('../controllers/pesquisas')

module.exports = async api => {
    api.route('/api/pesquisas/')
        .post(crawler.executeCrawler)
        .get(controller.getAll)

    api.route('/api/pesquisas/:codPesquisa')
        .get(controller.getById)

    
}