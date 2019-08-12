'use strict'

const crawler = require('../../app/services/processos')

module.exports = async api => {
    api.route('/api/processos/crawler')
        .post(crawler.executeCrawler)
}