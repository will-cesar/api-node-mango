## Comandos iniciais do projeto

- npm init 
    - comando para iniciar o projeto e criar o package.json

- npm i standard -D 
    - standardJS - biblioteca para padronização de código parecida com o ESLint
    - usa como padrão de código o JavaScript standard
    - o standard não é necessário criar uma configuração por arquivo igual o ESLint

- npm i lint-staged -D
    - biblioteca que permite que sejam rodados scripts dentro da "staged area"
    - ou seja, é possível fazer uma validação nos arquivos que irão entrar no próximo commit
    - "staged area" é o local onde ficam os arquivos que vão entrar no próximo commit
    - dentro do package.json é possível criar as configurações desses scripts
    - nesse projeto foi adicionado o script '*.js": ["standard --fix"]'
        - esse script significa que toda vez que ter um arquivo .js na staged area, esse arquivo será formatado conforme as regras do standardJs
        - o "--fix" tenta corrigir todos os problemas encontrado dentro do arquivo, modificando o arquivo
    - é possível extrair as configurações do package.json para um arquivo na raiz do projeto
    - nesse caso foi criado o arquivo .lintstagedrc.json e colocada as configurações dentro dele
    - foi criado também um script "pre-commit": "lint-staged --allow-empty" dentro do package.json para rodar o lint-staged
        - --allow-empty - permite commits vazios, quando não há alteração do arquivo pelo lint

- npm install husky --save-dev
    - biblioteca que permite utilizar hooks
    - é possível rodar scripts com esses hooks antes de algum evento, por exemplo um pré-commit
    - para iniciar a configuração dele, é preciso rodar o comando "npx husky-init"
    - é criado automáticamente uma pasta .husky onde é possível adicionar as configurações de cada evento
    - para criar novos eventos é necessário rodar o comando 'npx husky add .husky/evento (pre-commit, pre-push) "script_de_execução"'
    - nesse projeto foi criado uma configuração pré-commit para rodar os testes e o lint, e um pre-push para rodar o script "test:ci"
        - com essa configuração só é possível a criação do commit caso os comandos retornem sucesso   

- npm i jest -D
    - biblioteca responsável pelos testes
- jest --init
    - configuração inicial do jest no projeto, criando automaticamente o arquivo "jest.config.js"
    - para executar essa configuração é necessário ter o jest instalado de forma global
    - npm install -g jest

- npm i validator
    - biblioteca para validações de string (principalmente email)

- npm i mongodb
    - biblioteca de drivers do mongoDB para o NodeJS

- npm i @shelf/jest-mongodb -D
    - biblioteca que cria um banco mongoDb em memória para desenvolvimento
    - necessário seguir o passo a passo para a correta instalação
    - https://www.npmjs.com/package/@shelf/jest-mongodb

- npm i express

- npm i supertest -D
    - biblioteca que permite simular uma requisição

- npm i fast-glob

## Testes
- como boa prática, se inicia primeiro criando o arquivo de teste
- dentro dele, criar o primeiro teste, para assim logo em seguida criar os métodos e etc
- "sut" 
    - como boa prática, é nomeado o objeto que está sendo testado como sut
    - significa "system under test"
- "spy"
    - é uma classe de teste que fica capturando valores e fazendo comparações
    - por boa prática, é interessante colocar no final do nome da classe o "Spy" para itendificar que é uma classe spy
- flags - algumas flags adicionadas dentro do script de teste
    - "--watchAll":
        - Roda o teste sempre, sem precisar ficar reiniciando ele
        - toda vez que salvar qualquer arquivo do projeto, o teste será executado novamente
    - "--watch"
        - Roda os testes apenas nos arquivos que estão na staged area
        - serão executados somente os arquivos de testes modificados
    - "--passWithNoTests" 
        - Permite commits sem alterações nos arquivos de testes
    - "--findRelatedTests"
        - Roda somente os arquivos de testes modificados
        - ou seja, não rodara todos os testes da aplicação, somente os testes modificados 
        - é necessário especificar qual o local dos arquivos que serão afetados pela flag
    - "--silent"
        - exibe no relatório de testes somente os testes que apresentam erro
    - "--colors"
        - exibe o relatório colorido quando é utilizado o terminal externo do VsCode
    - "--noStackTrace"
        - não retorna o log completo do erro do teste
        - quando acontece um erro, ele retorna  de forma resumida qual teste está errado e qual
        o erro em específico
    - "--runInBand"
        - roda os testes em paralelo, sequencialmente
- .spec.js e .test.js
    - nesse projeto foi diferenciado os arquivos de testes unitários e testes integrados pelas suas extensões de cada arquivo
    - .spec.js - arquivos com testes unitários
    - .test.js - arquivos com testes de integração
- jest-unit-config.js
    - arquivo criado para adicionar algumas regras quando for executado testes unitários
    - nesse projeto, dentro desse arquivo foi adicionada a propriedade "testMatch", nela é possível configurar pela extensão do nome do arquivo, 
    quais serão os arquivos de testes que serão executados
- jest-integration-config.js
    - mesma coisa que oa arquivo "jest-unit-config.js", mas adicionando regras para testes de integração

## DDD - Domain Driven Design

- domain
    - onde é definido as entidades
    - podem ficar os casos de uso
    - no domínio é comum utilizar apenas dados e interface
    - a camada de domain nunca pode ter imports de outras camadas

- data
    - camada de implementação
    - utilização dos services
    - essa camada apenas se comunica com a camada de domain

- infra
    - onde ficam os repositories
    - se comunica diretamente apenas com a camada de data
    - nunca pode se comunicar com a camada de domain

- presentation
    - onde ficam os controllers
    - trata os dados vindo dos serviços

## Observações
- Status code: 401 = usado quando o sistema não identifica quem é o usuário
               403 = usado quando o sistema sabe quem é o usuário, mas ele não tem permissão para executar tal ação que foi solicitada

- Quando existe uma função assíncrona e ela é chamada sem o await, ela retorna uma promise

