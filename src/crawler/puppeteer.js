const puppeteer = require('puppeteer')
const Processo = require('../app/controllers/pesquisas')
const Foro = require('../app/controllers/foros')

var items = []

module.exports = {

    scrapper: async (url, cb) => {

        //Busca páginas
        process.setMaxListeners(10000)

        const pages = await getPages(url)

        return await buscarProcessos(pages)
    }

}

async function buscarProcessos(links) {

    var callback = []
    const codigoPesquisa = "ENLIGHTEN:"+Math.floor(Math.random() * 1000001)

    links.forEach(async url => {

        const browser = await puppeteer.launch({ headless: true,
            args: [
              '--disable-gpu',
              '--disable-dev-shm-usage',
              '--disable-setuid-sandbox',
              '--timeout=30000',
              '--no-first-run',
              '--no-sandbox',
              '--no-zygote',
              '--single-process',
              "--proxy-server='direct://'",
              '--proxy-bypass-list=*',
              '--deterministic-fetch',
            ],
          })
        const page = await browser.newPage()
        await page.goto(url, { waitUntil: 'load', timeout: 0 })


        const info = await page.evaluate(() => {

            var _process = null
            var _classe = null
            var _assunto = null
            var _distribuicao = null
            var _foro = null
            var _controle = null
            var _juiz = null
            var _valorAcao = null
            
            var capaProcesso = {}
            
            var resultCapaProcesso = []
            var resultParteProcess = []
            var resultPeticoesDiversas = []
            var resultMovimentacoes = []

            //Lista de Coluna 1
            const itensProcesso = document.querySelectorAll('.labelClass')
            
            itensProcesso.forEach(item => {

                if (item.textContent.includes('Classe')) {
                    _classe = item.nextSibling.parentNode.nextElementSibling.textContent.trim()
                }

                if (item.textContent.includes('Processo')) {
                    _process = item.nextSibling.parentNode.nextElementSibling.textContent.trim()
                }

                if (item.textContent.includes('Assunto:')) {
                    _assunto = item.nextSibling.parentNode.nextElementSibling.textContent.trim()
                }

                if (item.textContent.includes('Controle')) {
                    _controle = item.nextSibling.parentNode.nextElementSibling.textContent.trim()
                }

                if (item.textContent.includes('Distribuição')) {
                    _distribuicao = item.nextSibling.parentNode.nextElementSibling.textContent.trim()
                    _foro = item.parentElement.parentElement.nextElementSibling.textContent.trim()
                }
                if (item.textContent.includes('Juiz')) {
                    _juiz = item.nextSibling.parentNode.nextElementSibling.textContent.trim()
                }

                if (item.textContent.includes('Valor')) {
                    _valorAcao = item.nextSibling.parentNode.nextElementSibling.textContent.trim()
                }
                
            });


            //Parte do Processo
            const arrayPartesProcesso = document.querySelectorAll('span.mensagemExibindo')
            arrayPartesProcesso.forEach(item => {

                var parteProcesso = {}
                if (item.id == '') {
                    parteProcesso.tipo = item.textContent.trim().replace(':', '')

                    if (item.nextSibling.textContent.trim() == '') {
                        parteProcesso.responsavel = item.parentElement.nextElementSibling.firstChild.textContent.trim().replace(':', '')
                    } else {
                        parteProcesso.responsavel = item.nextSibling.textContent.trim().replace(':', '')
                    }

                    resultParteProcess.push(parteProcesso)
                }
            });

            //Petições diversas
            const arrayPeticoesDiversas = document.querySelectorAll('h2.subtitle')
            arrayPeticoesDiversas.forEach(item => {
                if (item.textContent.includes('Petições diversas')) {
                    var peticoesDiversas = {}
                    peticoesDiversas.data = item.parentNode.parentNode.parentNode.parentNode.parentNode.nextSibling.firstChild
                    //peticoesDiversas.tipo = item.textContent
                    resultPeticoesDiversas.push(peticoesDiversas)
                }
            })

            // //Movimentações 
            const headers = ['Data', 'Tipo']
            const arrayMovimentacoesLinhas = Array.from(document.querySelectorAll('#tabelaUltimasMovimentacoes tr'))
            arrayMovimentacoesLinhas.forEach(row => {

                var movimentacoes = {}
                movimentacoes.data = row.querySelector('td:nth-child(1)').textContent.trim()
                movimentacoes.movimento = row.querySelector('td:nth-child(3)').textContent.trim().replace(/\r?\n?\t|\r/g, '')

                resultMovimentacoes.push(movimentacoes)
            });

            return {
                title: document.title,
                capaProcesso: 
                [{
                    processo: _process,
                    classe: _classe,
                    assunto: _assunto,
                    distribuicao: _distribuicao,
                    foro: _foro,
                    controle: _controle,
                    juiz: _juiz,
                    valorAcao: _valorAcao
                }],
                partes: resultParteProcess,
                peticoes: resultPeticoesDiversas,
                movimentacoes: resultMovimentacoes
            }


        })

        await page.close()
        info.urlPesquisa = url
        info.codigoPesquisa = codigoPesquisa

        Processo.create(info)

    })

    const response = {status: "SUCCESS", message: "Carga realizada com sucesso!!!" }
    return response    
}

//Buscar Páginas
async function getPages(url) {

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()

    console.log(`URL: ${url}`);
    console.log('Páginas: getPages');
    console.log(`URL: ${url}`);

    await page.goto(url, { waitUntil: 'load', timeout: 10000 })

    const info = await page.evaluate(() => {

        const prefix = 'https://esaj.tjsp.jus.br'

        //Qtd Páginas
        let qtdePages = 0
        const qtde = document.querySelectorAll('a')
        console.log(`Páginas:${qtde}`);

        //Buscar páginas
        const links = document.querySelectorAll('a.linkProcesso')
        let response = []

        links.forEach(link => {
            response.push(prefix + link.getAttribute('href'))
        });

        return response

    })

    await page.close()

    return info
}


