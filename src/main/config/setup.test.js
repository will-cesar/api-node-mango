const request = require('supertest')
const app = require('./app')

describe('App Setup', () => {
  test('Should disable x-powered-by header', async () => {
    /*
      Teste para saber se a propriedade "x-powered-by" foi removida
    */

    // cria uma rota apenas para testes
    app.get('/test_x_powered_by', (req, res) => {
      res.send('')
    })

    const res = await request(app).get('/test_x_powered_by')
    expect(res.headers['x-powered-by']).toBeUndefined()
  })

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
