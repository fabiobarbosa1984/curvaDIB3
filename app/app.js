const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { converterVencimento } = require('./converterVencimento');
const datas = require('./datas.js')

const app = express();
const port = 3000; 


app.get('/processar-tabela', async (req, res) => {
  try {
    const dataParam = req.query.data;
    const url = `https://www2.bmf.com.br/pages/portal/bmfbovespa/boletim1/SistemaPregao_excel1.asp?Data=${dataParam}&Mercadoria=DI1&XLS=true`;

    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);
    const tabela = $('table');

    let encontrouMercadoFuturo = false;
    let encontrouAjuste = false;
    let duAnterior = 0; //variável de auxílio para otimizar o calculo de dias uteis
    let dataAnterior = dataParam; // variável de auxílio para otimizar o calculo de dias uteis
    const dadosProcessados = [];

    tabela.find('tr').each((index, row) => {
      const colunas = $(row).find('td');

      const codigoVencimento = colunas.eq(0).text().trim();
      const volume = parseInt(colunas.eq(5).text().trim().replace(/\./g,""));
      const ultimaTaxa = colunas.eq(12).text().trim();
      const precoAjuste = parseFloat(colunas.eq(13).text().trim().replace(/\./g,'').replace(',','.'));
      const vencimento = converterVencimento(codigoVencimento);

      if (!encontrouMercadoFuturo || !encontrouAjuste) {
        const textoCelula = colunas.eq(0).text().trim();
        if (textoCelula.includes('MERCADO FUTURO')) {
          encontrouMercadoFuturo = true;
        }
        if (ultimaTaxa.includes('AJUSTE')){
          encontrouAjuste = true;
        }
      } else {
        if (vencimento.includes('TAXA DI')) {
          return false;
        }

        const linhaVazia = vencimento === '' && precoAjuste === '';

        //exclui sempre os casos onde não houve negócios no vértice
        if (!linhaVazia & volume >0) {
          const vencimentoAjustado = datas.corrigirVencimento(vencimento);

          //para agilizar o cálculo de dias úteis a função já considera a quantidade de dias uteis calculados anteriormente de forma a evitar ter que calcular múltiplas vezes para o mesmo espaço temporal
          //assim, a cada iteração, o vencimento do vértice anterior é usado como referência para o cálculo e a quantidade de dias úteis do vértice anterior é somado ao resultado
          //dessa forma, o cálculo que antes leva um minuto e vinte segundos foi reduzido para 10 segundos
          const diasUteis = datas.diaTrabalhoTotal(dataAnterior,vencimentoAjustado) + duAnterior;
          dataAnterior = vencimentoAjustado;
          duAnterior = diasUteis;

          const taTemp = (Math.pow((100000/precoAjuste),(252/diasUteis))-1)*100;
          const taxaAjuste = parseFloat(taTemp.toFixed(2));

          dadosProcessados.push({ codigoVencimento: codigoVencimento, vencimentoAjustado,diasUteis, volume, ultimaTaxa: parseFloat(ultimaTaxa), precoAjuste: precoAjuste, taxaAjuste});
        }
      }
    });

    res.json(dadosProcessados); // Envia os dados processados como resposta JSON
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Ocorreu um erro' });
  }
});

// Iniciar o servidor
module.exports = app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
