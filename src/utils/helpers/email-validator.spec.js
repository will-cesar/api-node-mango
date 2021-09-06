jest.mock("validator", () => ({
  isEmailValid: true,

  isEmail(email) {
    this.email = email;
    return this.isEmailValid;
  },
}));

const validator = require("validator");
const MissingParamError = require("../errors/missing-param-error");
const EmailValidator = require("./email-validator");

const makeSut = () => {
  /*
    Factory para criar a instância do EmailValidator()
  */
  return new EmailValidator();
};

describe("Email Validator", () => {
  test("Should return true if validator returns true", () => {
    /*
      - Teste responsável por validar se o retorno da biblioteca validator é true
      - Caso seja true, é necessário o método retornar true também
      - Esse teste tem como objetivo saber se o retorno da classe EmailValidator está correto
      - Por isso foi criado um arquivo dentro da pasta "__mocks__" para "substituir" a biblioteca validator
      - Não é necessário testar os retornos da bilbioteca em si, o que é necessário é testar o retorno da classe criada
      - Isso serve para o teste em seguida, que é caso retorne false
    */

    const sut = makeSut();
    const isEmailValid = sut.isValid("valid_email@email.com");
    expect(isEmailValid).toBe(true);
  });

  test("Should return false if validator returns false", () => {
    /*
      - Teste responsável por validar se o retorno da biblioteca validator é false
      - Caso seja false, é necessário que o método retorne false também
      - Por padrão, o mock "validator" retorna sempre true a propriedade "isEmailValid"
      - Para o teste ser bem sucedido é necessário passar o valor false dentro do teste
    */

    validator.isEmailValid = false;
    const sut = makeSut();
    const isEmailValid = sut.isValid("invalid_email@email.com");
    expect(isEmailValid).toBe(false);
  });

  test("Should call validator with correct email", () => {
    /*
      - Teste para validar se o email que foi passado para o validator é o mesmo que esta
      sendo enviado para ele
    */

    const sut = makeSut();
    sut.isValid("any_email@email.com");
    expect(validator.email).toBe("any_email@email.com");
  });

  test("Should throw if no email is provided", async () => {
    /*
      - Teste para retornar um erro caso nenhum email seja passado
      como parâmetro na função
      - Quando estamos testando uma exceção de um método não assíncrono
      precisamos passar o ponteiro da função, e não a função em si,
      por exemplo: sut.isValid
      - Mas, também é possível passar uma arrow function e chamar
      da forma convencional o método, assim podem passar N parâmetros
      caso seja necessário
    */

    const sut = makeSut();
    expect(() => {
      sut.isValid();
    }).toThrow(new MissingParamError("email"));
  });
});
