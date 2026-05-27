# Da Praça Delievery 

Esse projeto é para o app de Delievery do da Praça.

## Requisitos

### Prérequisitos

Tenha já instalado esses pacotes em seu computador para instalação do sistema:

- [Node.js](https://nodejs.org/) (Com NPM)

Enquanto não necessário, tenha também esse pacote já instalado para convencia para baixar o repositorio:

- [Git](https://git-scm.com/)

### Instalação

1. Clone o repositório:

   ```bash
   gh repo clone NathansUnifil/DaPracaAppDelievery

2. Entre no repositório baixado usando seu terminal, no lugar aonde você baixou:
   cd DaPracaAppDelievery
   
3. npm install

## Scripts

na pasta principal do projeto, usa o comando:

### npm start

Roda o app no modo de desenvolvimento\
Abre [http://localhost:3000](http://localhost:3000) para ver em ação.

* além disso, ativa o database do app. navege para a pasta de backend com:
  -cd backend
  e usa npm start

A pagina vai ter que ser recarregada quando mudanças são feitas.
Você também pode ver qualquer erro no console.

### npm test

Esse comando inicia o aplicativo no modo de stress test.

### npm run build

Compila o aplicativo para produção na pasta `build`.

A versão compilada está minificada e os nomes dos arquivos incluem os hashes.

### npm run eject

**Nota: esta é uma operação irreversível. Quando você rodar esse comando, você não pode aborta-ló!**

Esse comando irá remover as dependencias, configurações e as ferramentas de compilação do projeto. Use ela quando você estiver com erros com suas configurações atuais. Esse comando é usado apenas para desenvolvimento, e não deve ser usado em produção.
