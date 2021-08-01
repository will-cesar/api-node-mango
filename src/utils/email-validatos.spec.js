const validator = require('validator')

class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}

describe('Email Validator', () => {
  /*
    - Teste responsável por validar se o retorno da biblioteca validator é true
    - Caso seja true, é necessário o método retornar true também
    - Esse teste tem como objetivo saber se o retorno da classe EmailValidator está correto
    - Por isso foi criado um arquivo dentro da pasta "__mocks__" para "substituir" a biblioteca validator
    - Não é necessário testar os retornos da bilbioteca em si, o que é necessário é testar o retorno da classe criada
    - Isso serve para o teste em seguida, que é caso retorne false
  */
  test('Should return true if validator returns true', () => {
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('valid_email@email.com')
    expect(isEmailValid).toBe(true)
  })

  test('Should return false if validator returns false', () => {
    /*
    - Teste responsável por validar se o retorno da biblioteca validator é false
    - Caso seja true, é necessário o método retornar false também
    - Por padrão, o mock "validator" retorna sempre true a propriedade "isEmailValid"
    - Para o teste ser bem sucedido é necessário passar o valor false dentro do teste
  */
    validator.isEmailValid = false
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('invalid_email@email.com')
    expect(isEmailValid).toBe(false)
  })
})
