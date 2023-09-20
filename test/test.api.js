const app = require('../app/app.js');
const request = require('supertest');
const { expect } = require('chai');

let server; // Declare a variable to hold the server instance


  after((done) => {
    // Close the Express server after all tests are complete
    app.close(() => {
      console.log('Express server closed.');
      done();
    });
  });

  it('Should return an array of JSON objects when calling /getcurve with a querystring parameter Data', async () => {
    const dataQueryParam = '15/08/2023';

    const response = await request(app)
      .get(`/getcurve?data=${dataQueryParam}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).to.be.an('array');

    // Verifies if each element of the array has the expected properties
    response.body.forEach((item) => {
      expect(item).to.have.property('codigoVencimento');
      expect(item).to.have.property('vencimentoAjustado');
      expect(item).to.have.property('diasUteis');
      expect(item).to.have.property('volume');
      expect(item).to.have.property('ultimaTaxa');
      expect(item).to.have.property('precoAjuste');
      expect(item).to.have.property('taxaAjuste');
    });
  });
