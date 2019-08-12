'use strict'

var crawler = require('../../crawler/puppeteer')

module.exports = {
    executeCrawler: async (req, res) => {

        let foro = req.body.foro
        let filter = req.body.filter
        let valorConsulta = req.body.valorConsulta
        console.log(foro);
        

        let url = `https://esaj.tjsp.jus.br/cpopg/search.do?conversationId=&dadosConsulta.localPesquisa.cdLocal=${foro}&cbPesquisa=${filter}&dadosConsulta.tipoNuProcesso=SAJ&dadosConsulta.valorConsulta=${valorConsulta}`

        var response = await crawler.scrapper(url)
        res.send(response)   
    }
}