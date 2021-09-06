const MongoHelper = require('../helpers/mongo-helper')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')
const MissingParamError = require('../../utils/errors/missing-param-error')
let userModel

const makeSut = () => {
  return new LoadUserByEmailRepository()
}

describe('LoadUserByEmail Repository', () => {
  beforeAll(async () => {
    /*
      Antes de iniciar os métodos de testes, é necessário
      se conectar ao banco de dados
    */

    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    /*
      Antes de iniciar cada teste, é necessário
      limpar as tabelas de 'users'
    */

    await userModel.deleteMany()
  })

  afterAll(async () => {
    /*
      Após os testes ocorre o disconnect com o mongoDb
    */

    await MongoHelper.disconnect()
  })

  test('Should return null if no user is found', async () => {
    const sut = makeSut()
    const user = await sut.load('invalid_email@email.com')
    expect(user).toBeNull()
  })

  test('Should returns an user if user is found', async () => {
    const sut = makeSut()

    const fakeUser = await userModel.insertOne({
      email: 'valid_email@email.com',
      name: 'any_name',
      age: 50,
      state: 'any_state',
      password: 'hashed_password'
    })

    const user = await sut.load('valid_email@email.com')

    expect(user._id).toEqual(fakeUser.insertedId)
  })

  test('Should throw if no email is provided', async () => {
    const sut = makeSut()
    const promise = sut.load()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
