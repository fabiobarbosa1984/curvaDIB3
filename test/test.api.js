const app = require('../app/app.js'); 
const request = require('supertest');
const { expect } = require('chai');

describe('Testes da API', () => {
  it('Should return an array of json objects when calling /getcurve with a querystring parameter Data', async () => {
    const dataQueryParam = '15/08/2023'; 

    const response = await request(app)
      .get(`/getcurve?data=${dataQueryParam}`)
      .expect('Content-Type', /json/)
      .expect(200);

    
    expect(response.body).to.be.an('array');

    // Verifica se cada elemento do array possui as propriedades esperadas
    response.body.forEach(item => {
      expect(item).to.have.property('codigoVencimento');
      expect(item).to.have.property('vencimentoAjustado');
      expect(item).to.have.property('diasUteis');
      expect(item).to.have.property('volume');
      expect(item).to.have.property('ultimaTaxa');
      expect(item).to.have.property('precoAjuste');
      expect(item).to.have.property('taxaAjuste');
    });
    
  });
});
