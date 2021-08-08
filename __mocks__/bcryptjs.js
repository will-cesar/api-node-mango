/*
  - Mock representando a biblioteca bcryptjs
  - Com o mesmo nome da bibioteca, qualquer arquivo que utiliza-lá irá pegar o mock validator ao invés da biblioteca em si
  - Esse mock é utilizado pois é necessário testar o retorno da classe, e não o retorno da biblioteca, já que a mesma funciona
  de forma correta
*/

module.exports = {
  isValid: true,

  async compare (value, hash) {
    return this.isValid
  }
}
