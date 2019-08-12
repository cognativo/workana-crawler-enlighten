'use strict'

const crawler = require('../services/pesquisas')

module.exports = async api => {
    api.route('/api/pesquisas/')
        .post(crawler.executeCrawler)
}