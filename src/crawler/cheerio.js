'use sctrict'

const axios = require('axios');
const cheerio = require('cheerio');


async function getPage() {
   
    const url = 'https://esaj.tjsp.jus.br/cpopg/show.do?processo.codigo=1E00228MZ0000&processo.foro=50&conversationId=&dadosConsulta.localPesquisa.cdLocal=50&cbPesquisa=NUMOAB&dadosConsulta.tipoNuProcesso=UNIFICADO&dadosConsulta.valorConsulta=SP&uuidCaptcha=&paginaConsulta=1'
    
    var response = await axios.get(url)
    
    data = []

    const $ = cheerio.load(response.data)

    let classe = $('body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(8) > table.secaoFormBody > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td > span:nth-child(1) > span').text()
    let dadosProcesso = $('.labelClass').each((i, elem) => {
        if( $(elem).text().includes('Processo')) {
            data.push({                
                processo: $('body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(8) > table.secaoFormBody > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr > td > span:nth-child(1)').text().trim()
                })                
        } 

        if( $(elem).text().includes('Assunto')) {
            data.push({assunto: $(elem).siblings('span')})                          
        } 
    })

    console.log(data);
    
}

getPage()
