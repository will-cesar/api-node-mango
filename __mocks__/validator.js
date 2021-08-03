/*
  - Mock representando a biblioteca validator.js
  - Com o mesmo nome da bibioteca, qualquer arquivo que utiliza-lá irá pegar o mock validator ao invés da biblioteca em si
  - Esse mock é utilizado pois é necessário testar o retorno da classe, e não o retorno da biblioteca, já que a mesma funciona
  de forma correta
*/

module.exports = {
  isEmailValid: true,
  email: '',

  isEmail (email) {
    this.email = email
    return this.isEmailValid
  }
}