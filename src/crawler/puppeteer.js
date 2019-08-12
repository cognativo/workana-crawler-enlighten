const puppeteer = require('puppeteer')
const Processo = require('../app/controllers/processos')
const Foro = require('../app/controllers/foros')

var items = []

module.exports = {

    scrapper: async (url) => {

        var response = []
        //Busca páginas
        console.log(url);
        process.setMaxListeners(3000)
        
        const pages = await getPages(url)

        pages.forEach(async page => {
           response.push(await buscarProcessos(page))       
        });
    
        // const foros = await getForos()
        // foros.forEach(async foro => {
        //     await Foro.create(foro)      
        // });
        console.log(response);
        
        return response
    }

}

async function buscarProcessos(url) {
    const browser = await puppeteer.launch()
    const page = await  browser.newPage()

    await page.goto(url, {waitUntil: 'load', timeout: 0})
    //await page.screenshot({path: 'incrivel.png'});
    
    //Verifica se tem JS de Tabela
    //var movs = await page.click("#linkmovimentacoes");
    //await page.waitForNavigation(5000);
    
    const info = await page.evaluate(() => {

        var _process = null
        var _classe = null
        var _assunto = null
        var _distribuicao = null
        var _foro = null
        var _controle = null
        var _juiz = null
        var _valorAcao = null
       
        var resultParteProcess = []
        var resultPeticoesDiversas = []
        var resultMovimentacoes = []

        //Montar atributos
        console.log("montar atributos");
        if (document.querySelector('body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(8) > table.secaoFormBody > tbody > tr:nth-child(3) > td:nth-child(2) > table > tbody > tr > td > span:nth-child(1) > span') === null) {
            console.log("Passo 1");            
            _classe = document.querySelector('body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(8) > table.secaoFormBody > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td > span:nth-child(1) > span').textContent.trim()
        } else {
            console.log("Passo 2");
            _classe = document.querySelector('body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(8) > table.secaoFormBody > tbody > tr:nth-child(3) > td:nth-child(2) > table > tbody > tr > td > span:nth-child(1) > span').textContent.trim()
        }
        
        //Lista de Coluna 1
        const coluna1 = document.querySelectorAll('.labelClass')
        console.log(coluna1);
        
        coluna1.forEach(item => {
            if( item.textContent.includes('Processo')) {
                _process = document.querySelector('body > div > table:nth-child(4) > tbody > tr > td > div:nth-child(8) > table.secaoFormBody > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr > td > span:nth-child(1)').textContent.trim()
            }  
            
            if( item.textContent.includes('Assunto')) {
                _assunto = item.nextSibling.parentNode.nextElementSibling.textContent.trim()
            }   

            if( item.textContent.includes('Controle')) {
                _controle = item.nextSibling.parentNode.nextElementSibling.textContent.trim()
            }     
            
            if( item.textContent.includes('Distribuição')) {
                _distribuicao = item.nextSibling.parentNode.nextElementSibling.textContent.trim()
                _foro = item.parentElement.parentElement.nextElementSibling.textContent.trim()    
            }
            if( item.textContent.includes('Juiz')) {
                _juiz = item.nextSibling.parentNode.nextElementSibling.textContent.trim()
            }  

            if( item.textContent.includes('Valor')) {
                _valorAcao = item.nextSibling.parentNode.nextElementSibling.textContent.trim()
            }  
        });

        //Parte do Processo
        const arrayPartesProcesso = document.querySelectorAll('span.mensagemExibindo')
        arrayPartesProcesso.forEach(item => {

            var parteProcesso = {}
            if(item.id == ''){
                parteProcesso.tipo = item.textContent.trim().replace(':','')
                
                if(item.nextSibling.textContent.trim() == '') {
                    parteProcesso.responsavel = item.parentElement.nextElementSibling.firstChild.textContent.trim().replace(':','')
                } else {
                    parteProcesso.responsavel = item.nextSibling.textContent.trim().replace(':','')
                }

                resultParteProcess.push(parteProcesso)
            }
        });

        //Petições diversas
        const arrayPeticoesDiversas = document.querySelectorAll('h2.subtitle')
        arrayPeticoesDiversas.forEach(item => {
            if(item.textContent.includes('Petições diversas')){
                var peticoesDiversas = {}
                peticoesDiversas.data = item.parentNode.parentNode.parentNode.parentNode.parentNode.nextSibling.firstChild
                //peticoesDiversas.tipo = item.textContent
                resultPeticoesDiversas.push(peticoesDiversas)
            }
        }) 

        //Movimentações 
        const headers = ['Data','Tipo']
        const arrayMovimentacoesLinhas = Array.from(document.querySelectorAll('#tabelaUltimasMovimentacoes tr'))
        arrayMovimentacoesLinhas.forEach(row => {
           
            var movimentacoes = {}
            movimentacoes.data = row.querySelector('td:nth-child(1)').textContent.trim()
            movimentacoes.movimento = row.querySelector('td:nth-child(3)').textContent.trim().replace(/\r?\n?\t|\r/g, '')

            resultMovimentacoes.push(movimentacoes)
        });
       
        return {     
            title: document.title,
            processo: _process,
            classe: _classe,
            assunto: _assunto,
            distribuicao: _distribuicao,
            foro: _foro,
            controle: _controle,
            juiz: _juiz,
            valorAcao: _valorAcao,
            partes: resultParteProcess,
           // peticoes: resultPeticoesDiversas,
            movimentacoes: resultMovimentacoes
        }

    })
   
    await page.close()

    return info
}
//Buscar Páginas
async function getPages(url) {

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    //const url = 'https://esaj.tjsp.jus.br/cpopg/search.do?conversationId=&dadosConsulta.localPesquisa.cdLocal=50&cbPesquisa=NUMOAB&dadosConsulta.tipoNuProcesso=UNIFICADO&dadosConsulta.valorConsulta=sp&uuidCaptcha=sajcaptcha_198ee82f532f47e296ffbe356df8a0eb'

    await page.goto(url,{waitUntil: 'load', timeout: 0})

    const info = await page.evaluate(() => {
    
        const prefix = 'https://esaj.tjsp.jus.br'
        
        //Qtd Páginas
        let qtdePages = 0
        const qtde = document.querySelectorAll('a')

        //Buscar páginas
        const links = document.querySelectorAll('a.linkProcesso')
        let response = []

        links.forEach(link => {
            response.push(prefix+link.getAttribute('href'))
        });

        return response

    })
    
    await page.close()

    return info
}

// const getForos = async () => {
    
//     const browser = await puppeteer.launch()
//     const page = await  browser.newPage()
//     const url = 'https://esaj.tjsp.jus.br/cpopg/open.do'
    
//     await page.goto(url)
    
//     const info = await page.evaluate(() => {
        
//         //Buscar foros
//         const foros = document.querySelectorAll('#id_foro option')
//         let response = []

//         foros.forEach(foro => {
//             response.push({code: foro.getAttribute('value'),  foro: foro.textContent.trim()})
//         });

//         return response

//     })

//     await page.close()
//     return info

// }


