const request = require('supertest')
const app = require('../config/app')

describe('JSON Parser Middleware', () => {
  test('Should parse body as JSON', async () => {
    /*
      Teste para saber se está ativado o body parser na app
    */

    app.post('/test_json_parser', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test_json_parser')
      .send({ name: 'Mango' })
      .expect({ name: 'Mango' })
  })
})
