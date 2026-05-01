# Da Praça Delievery 

Esse projeto é para o app de Delievery do da Praça.

## Index

- [Requisitos](#requisitos)
  - [Prérequisitos](#Prerequisitos)
  - [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Running Tests](#running-tests)
- [Deployment](#deployment)

## Requisitos

### Prérequisitos

Tenha já instalado esses pacotes em seu computador:

- [Node.js](https://nodejs.org/) (Com NPM)

### Instalação

1. Clone o repositório:

   ```bash
   gh repo clone NathansUnifil/DaPracaAppDelievery

2. Entre no repositório baixado usando seu terminal, no lugar aonde você baixou:
   cd DaPracaAppDelievery
3. npm install

## Scripts

na pasta principal do projeto, usa o comando:

### `npm start`

Roda o app no modo de desenvolvimento\
Abre [http://localhost:3000](http://localhost:3000) para ver em ação.

* além disso, ativa o database do app. navege para a pasta de backend com:
  -cd backend
  e usa
### `npm start`

A pagina vai ter que ser recarregada quando mudanças são feitas.\
Você também pode ver qualquer erro no console.

### `npm test`

Esse comando inicia o aplicativo no modo de stress test.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Compila o aplicativo para produção na pasta `build`.\
O comando agrupa corretamente o React e o app em modo de produção e otimiza a compilação para obter o melhor desempenho.

A versão compilada está minificada e os nomes dos arquivos incluem os hashes.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Nota: esta é uma operação irreversível. Quando você rodar esse comando, você não pode aborta-ló!**

Esse comando irá remover as dependencias, configurações e as ferramentas de compilação do projeto. Use ela quando você estiver com erros com suas configurações atuais. Esse comando é usado apenas para desenvolvimento, e não deve ser usado em produção.
