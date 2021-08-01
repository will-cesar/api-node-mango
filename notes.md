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
    - é possível rodar scripts com esses hooks antes de algum evento, por exemplo um pré-commit
    - para iniciar a configuração dele, é preciso rodar o comando "npx husky-init"
    - é criado automáticamente uma pasta .husky onde é possível adicionar as configurações de cada evento
    - nesse projeto foi criado uma configuração pré-commit para rodar os testes e o lint
        - com essa configuração só é possível a execução do commit caso os dois comandos retornem sucesso

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

## Observações
- Status code: 401 = usado quando o sistema não identifica quem é o usuário
               403 = usado quando o sistema sabe quem é o usuário, mas ele não tem permissão para executar tal ação que foi solicitada