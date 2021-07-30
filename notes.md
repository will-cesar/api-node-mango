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
        - o comando "git add" adiciona novamente o arquivo na staged area antes de realizar o commit
    - é possível extrair as configurações do package.json para um arquivo na raiz do projeto
    - nesse caso foi criado o arquivo .lintstagedrc.json e colocada as configurações dentro dele

- npm install husky --save-dev
    - biblioteca que permite utilizar hooks
    - é possível rodar scripts com esses hooks antes de algum evento, por exemplo um commit
    - essa configuração é feita dentro do package.json 
    - nesse projeto foi adicionado o script 'pre-commit": "lint-staged'
        - nesse caso, antes de qualquer commit é acionado o script do "lint-staged"
        - o lint-staged vai verificar todos os arquivos js dentro da staged area e rodar o script do standardJs
    - é possível extrair as configurações do package.json para um arquivo na raiz do projeto
    - nesse caso foi criado o arquivo .huskyrc.json e colocada as configurações dentro dele

- npm i jest -D
    - biblioteca responsável pelos testes
- jest --init
    - configuração inicial do jest no projeto, criando automaticamente o arquivo "jest.config.js"
    - para executar essa configuração é necessário ter o jest instalado de forma global
    - npm install -g jest

## Testes
- como boa prática, se inicia primeiro criando o arquivo de teste
- dentro dele, criar o primeiro teste, para assim logo em seguida criar os métodos e etc
- "sut" 
    - como boa prática, é nomeado o objeto que está sendo testado como sut
    - significa "system under test"
- "--watchAll" 
    - flag colocada dentro do script de teste para rodar o teste sempre, sem precisar ficar reiniciando ele
    - toda vez que salvar, o teste será executado novamente
- "spy"
    - é uma classe de teste que fica capturando valores e fazendo comparações