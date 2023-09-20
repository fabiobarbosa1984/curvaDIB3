const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const {codeToMaturity}  = require('./codeToMaturity.js');
const dates = require('./dates.js')

const app = express();
const port = 3000; 


app.get('/getcurve', async (req, res) => {
  try {
    const dataParam = req.query.data;
    const url = `https://www2.bmf.com.br/pages/portal/bmfbovespa/boletim1/SistemaPregao_excel1.asp?Data=${dataParam}&Mercadoria=DI1&XLS=true`;

    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);
    const tabela = $('table');

    let MercadoFuturoFound = false;
    let AjusteFound = false;
    let previousWd = 0; //variável de auxílio para otimizar o calculo de dias uteis
    let previousDate = dataParam; // variável de auxílio para otimizar o calculo de dias uteis
    const data = [];

    tabela.find('tr').each((index, row) => {
      const columns = $(row).find('td');

      const maturityCode = columns.eq(0).text().trim();
      const volume = parseInt(columns.eq(5).text().trim().replace(/\./g,""));
      const lastYield = columns.eq(12).text().trim();
      const adjustPrice = parseFloat(columns.eq(13).text().trim().replace(/\./g,'').replace(',','.'));
      const maturity = codeToMaturity(maturityCode);

      if (!MercadoFuturoFound || !AjusteFound) {
        const cellText = columns.eq(0).text().trim();
        if (cellText.includes('MERCADO FUTURO')) {
          MercadoFuturoFound = true;
        }
        if (lastYield.includes('AJUSTE')){
          AjusteFound = true;
        }
      } else {
        if (maturity.includes('TAXA DI')) {
          return false;
        }

        const emptyLine = maturity === '' && adjustPrice === '';

        //exclui sempre os casos onde não houve negócios no vértice
        if (!emptyLine & volume >0) {
          const adjustedMaturity = dates.fixMaturity(maturity);

          //para agilizar o cálculo de dias úteis a função já considera a quantidade de dias uteis calculados anteriormente de forma a evitar ter que calcular múltiplas vezes para o mesmo espaço temporal
          //assim, a cada iteração, o vencimento do vértice anterior é usado como referência para o cálculo e a quantidade de dias úteis do vértice anterior é somado ao resultado
          //dessa forma, o cálculo que antes leva um minuto e vinte segundos foi reduzido para 10 segundos
          const wd = dates.netWorkDays(previousDate,adjustedMaturity) + previousWd;
          previousDate = adjustedMaturity;
          previousWd = wd;

          const taTemp = (Math.pow((100000/adjustPrice),(252/wd))-1)*100;
          const refYield = parseFloat(taTemp.toFixed(2));

          data.push({ codigoVencimento: maturityCode, vencimentoAjustado: adjustedMaturity,diasUteis: wd, volume, ultimaTaxa: parseFloat(lastYield), precoAjuste: adjustPrice, taxaAjuste: refYield});
        }
      }
    });

    res.json(data); // Envia os dados processados como resposta JSON
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Ocorreu um erro: '+error });
  }
});

// Iniciar o servidor
module.exports = app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
