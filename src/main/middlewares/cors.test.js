const request = require('supertest')
const app = require('../config/app')

describe('CORS Middleware', () => {
  test('Should enable CORS', async () => {
    /*
      Teste para saber se a app está permitindo requisições
      de outros domínios (CORS)
    */

    // cria uma rota apenas para testes
    app.get('/test_cors', (req, res) => {
      res.send('')
    })

    const res = await request(app).get('/test_cors')
    expect(res.headers['access-control-allow-origin']).toBe('*')
    expect(res.headers['access-control-allow-methods']).toBe('*')
    expect(res.headers['access-control-allow-headers']).toBe('*')
  })
})
