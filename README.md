# API Testes - Express (codigos/API)

API de exemplo para aprendizado de testes e automação (Mocha, Supertest)

Pré-requisitos

- Node.js 14+

Instalação

1. Entre na pasta do projeto:

   cd "codigos/API"

2. Instale dependências:

   npm install

Uso

- Iniciar servidor:

  npm start

- Rodar em modo desenvolvimento (nodemon):

  npm run dev

- Executar testes (Mocha):

  npm test

Endpoints principais

- POST /users - registra usuário
  body: { name, email, password, favored?, balance? }
- GET /users - lista usuários
- POST /auth/login - login com { email, password }
- POST /transfers - realiza transferência { fromId, toId, amount }
- GET /api-docs - documentação Swagger

Regras de negócio importantes

1) Para logar, email e senha devem ser informados.
2) Não é possível registrar usuários com email duplicado.
3) Transferências para destinatários que não são marcados como "favorecido" só podem ser realizadas se o valor for menor que R$ 5.000,00.

Banco de dados

- Em memória (array). Reiniciar a aplicação limpa os dados.

Observações

- O arquivo `app.js` exporta o app sem fazer listen para facilitar testes com Supertest.
