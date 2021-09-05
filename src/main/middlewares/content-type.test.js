const request = require('supertest')
const app = require('../config/app')

describe('Content-Type Middleware', () => {
  test('Should return json content-type as default', async () => {
    /*
      Teste para garantir que todas as requisições respondam com o
      header do Content-Type do tipo JSON
    */

    app.get('/test_content_type', (req, res) => {
      res.send('')
    })

    await request(app).get('/test_content_type').expect('content-type', /json/)
  })

  test('Should return xml content-type if forced', async () => {
    /*
      Teste para garantir que o retorno dessa requisição seja em xml,
      pois foi forçada para essa rota acontecer esse caso
    */

    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      res.send('')
    })

    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})
