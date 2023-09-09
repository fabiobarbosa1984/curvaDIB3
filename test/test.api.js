const app = require('../app/app.js'); 
const request = require('supertest');
const { expect } = require('chai');

describe('Testes da API', () => {
  it('Deve retornar um array de objetos JSON ao chamar /processar-tabela com parâmetro data', async () => {
    const dataQueryParam = '15/08/2023'; 

    const response = await request(app)
      .get(`/processar-tabela?data=${dataQueryParam}`)
      .expect('Content-Type', /json/)
      .expect(200);

    // Verifica se a resposta é um array
    expect(response.body).to.be.an('array');

    // Verifica se cada elemento do array possui as propriedades esperadas
    response.body.forEach(item => {
      expect(item).to.have.property('codigo_vencimento');
      expect(item).to.have.property('vencimentoAjustado');
      expect(item).to.have.property('diasUteis');
      expect(item).to.have.property('volume');
      expect(item).to.have.property('ultima_taxa');
      expect(item).to.have.property('preco_ajuste');
      expect(item).to.have.property('taxaAjuste');
    });
    
  });
});
