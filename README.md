
[![Node.js CI](https://github.com/leuthier/API-Transferencia/actions/workflows/tests.yml/badge.svg)](https://github.com/leuthier/API-Transferencia/actions/workflows/tests.yml)

# API Testes - Express & GraphQL

API de exemplo para aprendizado de testes e automação (Mocha, Supertest, GraphQL)

## Pré-requisitos

- Node.js 14+

## Instalação

1. Instale dependências:
   ```sh
   npm install
   ```
2. Copie o arquivo de variáveis de ambiente:
   ```sh
   cp env_example .env
   ```
   Edite o arquivo `.env` conforme desejar.

## Uso

- Iniciar servidor REST:
  ```sh
  npm run start-rest
  ```
- Iniciar servidor GraphQL:
  ```sh
  npm run start-graphql
  ```
- Executar todos os testes (REST e GraphQL):
  ```sh
  npm test
  ```
- Executar apenas testes REST externos:
  ```sh
  npm run test-rest-external
  ```
- Executar apenas testes REST de controller:
  ```sh
  npm run test-rest-controller
  ```
- Executar apenas testes GraphQL externos:
  ```sh
  npm run test-graphql-external
  ```

## Endpoints principais (REST)

- POST /users - registra usuário
  body: { name, email, password, favored?, balance? }
- GET /users - lista usuários
- POST /auth/login - login com { email, password }
- POST /transfers - realiza transferência { fromId, toId, amount }
- GET /api-docs - documentação Swagger

### Usuários (3 default users)
| id | name | email | password | favored | balance |
|----|------|-------|------------------|---------|---------|
| eb2d3111-4f9b-4bbe-88ec-89c623c49a46 | andre | `andre@gmail.com` | victor | `victor@leuth.com` | 5.000.000 |
| 8536109d-5824-41b9-97b6-3c0f381d6f80 | victor | `victor@leuth.com` | victor | `andre@gmail.com`, `string` | 1.234.567.890 |
| b81a5ae0-32fc-43b0-8f33-dbe419cd6033 | string | `string` | string | `andre@gmail.com` | 1.000 |
| 7c320a7c-10ea-456d-b8ab-4b95fee51602 | string32 | `string32` | string32 | `victor@leuth.com` | 987.654.321 |

## Playground GraphQL

Acesse em: [http://localhost:4000/graphql](http://localhost:4000/graphql)

## Autenticação GraphQL
- Para [mutations de transferência](#exemplos-de-mutations), envie o JWT no header:
  ```
  { "Authorization": "Bearer <token>" }
  ```
- O token é obtido via mutation `login`.

## Estrutura dos arquivos GraphQL
- `graphql/app.js`: Configuração do ApolloServer e Express (sem listen)
- `graphql/server.js`: Inicializa o servidor
- `graphql/schema.js`: Types e operações GraphQL
- `graphql/resolvers.js`: Implementação das queries e mutations
- `graphql/auth.js`: Middleware de autenticação JWT para GraphQL

## Exemplos de Mutations
```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      id
      name
      email
      favored
      balance
    }
  }
}
```

```graphql
mutation Transfer(
  $fromEmail: String!
  $toEmail: String!
  $amount: Float!
) {
  transfer(fromEmail: $fromEmail, toEmail: $toEmail, amount: $amount) {
    id
    from {
      id
      email
    }
    to {
      id
      email
    }
    amount
    createdAt
  }
}
```

## Exemplos de Queries
```graphql
query Users {
  users {
    id
    name
    email
    favored
    balance
  }
}
```

```graphql
query Transfer {
  transfers {
    id
    from {
      id
      email
    }
    to {
      id
      email
    }
    amount
    createdAt
  }
}
```

## Regras de negócio importantes

1) Para logar, email e senha devem ser informados.
2) Não é possível registrar usuários com email duplicado.
3) Transferências para destinatários que não são marcados como "favorecido" só podem ser realizadas se o valor for menor que R$ 5.000,00.
4) Não é possível transferir valores para a própria conta

## Banco de dados

- Em memória (array). Reiniciar a aplicação limpa os dados.

## Observações

- O arquivo `app.js` exporta o app sem fazer listen para facilitar testes com Supertest.

## Project Structure

```
.
├── app.js                 # Express app (exports app for tests)
├── server.js              # REST server entry (listen)
├── routes.js              # REST routes
├── swagger.json           # OpenAPI definition
├── package.json
├── docs/                  # HTML to be publish in GitHub Pages
│   └── k6/
│       └── reports        # k6 generated reports 
├── graphql/               # GraphQL server and schema
│   ├── app.js
│   ├── auth.js
│   ├── resolvers.js
│   ├── schema.js
│   ├── server.js
│   └── typeDefs.js
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── transferController.js
│   │   └── usersController.js
│   ├── middleware/
│   │   └── authenticateToken.js
│   ├── models/
│   │   ├── transferModel.js
│   │   └── userModel.js
│   ├── services/
│   │   ├── transferService.js
│   │   └── userService.js
│   └── utils/
│       └── sum.js
└── test/
    ├── k6/
    │   ├── desafio2.k6test.js
    │   ├── finalWork.k6test.js
    │   ├── finalWorkIterations.k6test.js
    │   ├── finalWorkStages.k6test.js
    │   ├── data/
    │   │   ├── login.test.data.json
    │   │   └── transferToAndre.test.data.json
    │   └── helpers/
    │       ├── apiCalls.js
    │       ├── baseUrl.js
    │       ├── login.js
    │       └── userFaker.js
    ├── rest/
    │   ├── controller/
    │   └── external/
    └── graphql/
        └── external/
```

## Testes de Performance - K6

- **Thresholds**: usados em [test/k6/finalWorkIterations.k6test.js](test/k6/finalWorkIterations.k6test.js) e [test/k6/finalWorkStages.k6test.js](test/k6/finalWorkStages.k6test.js) através da configuração `options.thresholds`.
- **Checks**: implementados com `check()` nos blocos `Register`, `Login` e `Transfer` em ambos os scripts (`finalWorkIterations.k6test.js` e `finalWorkStages.k6test.js`).
- **Helpers**: funções utilitárias em [test/k6/helpers/](test/k6/helpers):
  - [apiCalls.js](test/k6/helpers/apiCalls.js): centraliza a lógica de chamadas HTTP POST utilizadas nos testes de performance.
A URL é construída de acordo com a variável de ambiente, envia o payload em formato JSON com os headers apropriados e retorna a resposta da requisição.
  - [baseUrl.js](test/k6/helpers/baseUrl.js): define e exporta a URL base da API utilizada nos testes de performance com k6. Lê a variável de ambiente BASE_URL (fornecida ao executar o k6). Caso a variável não exista, usa um valor padrão local (`http://localhost:3000`)
  - [login.js](test/k6/helpers/login.js): implementa um helper de autenticação. A função `login` realiza uma chamada POST para o endpoint `/auth/login`, enviando as credenciais do usuário e retornando o token de autenticação presente na resposta. Esse token pode ser reutilizado em outras requisições que exigem autenticação, permitindo simular fluxos reais de usuários durante os testes.
  - [userFaker.js](test/k6/helpers/userFaker.js): fornece funções úteis para geração de dados aleatórios utilizando a extensão `k6/x/faker`. Permite criar emails, nomes e senhas fictícias, além de gerar objetos completos de usuários, facilitando a simulação de múltiplos usuários distintos durante os testes de performance e evitando conflitos de dados entre execuções.

- **Trends**: métrica customizada `transfer_duration` criada em `test/k6/finalWorkStages.k6test.js` usando `Trend` de `k6/metrics`.
- **Faker**: `k6/x/faker` é utilizado em `test/k6/helpers/userFaker.js` para gerar dados de usuário aleatórios durante o registro.
- **Variável de Ambiente**: `BASE_URL` é obtida de `__ENV.BASE_URL` em `test/k6/helpers/baseUrl.js`.
- **Stages**: definidos em `test/k6/finalWorkStages.k6test.js` sob `options.stages` para modelar ramp-up, picos e ramp-down.
- **Reaproveitamento de Resposta**: tokens de login são obtidos pelas chamadas de `login()` e reaproveitados nas requisições de transferência (token enviado no header `Authorization`).
- **Uso de Token de Autenticação**: o header `Authorization: Bearer <token>` é enviado nas chamadas ao endpoint `/transfers` nos testes.
- **Data-Driven Testing (DDT)**: dados de teste são carregados de arquivos JSON em `test/k6/data/` (por exemplo `login.test.data.json` e `transferToAndre.test.data.json`) e consumidos com `open()` e `SharedArray`.
- **Groups**: organização lógica com `group()` para separar `Register`, `Login` e `Transfer` em ambos os scripts.

### **Arquitetura — test/k6**

- **Helpers**: `test/k6/helpers/` contém utilitários reutilizáveis (`apiCalls.js`, `login.js`, `baseUrl.js`, `userFaker.js`).
- **Data**: `test/k6/data/` armazena fixtures JSON usadas pelos testes (`login.test.data.json`, `transferToAndre.test.data.json`).
- **Cenários / Scripts**: vários scripts k6 ficam em `test/k6/`, por exemplo `finalWorkIterations.k6test.js`, `finalWorkStages.k6test.js` e `desafio2.k6test.js`.

### **Relatórios de Execução do k6**
- Utilizando iterations: https://leuthier.github.io/API-Transferencia/k6/reports/finalWork_iterations-html-report.html
- Utilizando stages: https://leuthier.github.io/API-Transferencia/k6/reports/finalWork_stages-html-report.html

## **Tecnologias Utilizadas**

- **Node.js / Express**: implementação da API REST.
- **apollo-server-express** e **graphql**: servidor GraphQL e ferramentas de schema.
- **[k6](https://k6.io/)**: ferramenta de teste de performance (scripts de testes em [test/k6](test/k6/)).

### Bibliotecas adicionais:
- **bcryptjs**: hashing de senhas.
- **swagger-jsdoc** e **swagger-ui-express**: documentação da API (Swagger/OpenAPI).
- **uuid**: geração de ids únicos para modelos.
- **jsonwebtoken**: geração e verificação de tokens JWT.
- **dotenv**: gerenciamento de variáveis de ambiente.
- **chai**, **sinon**: bibliotecas de asserção e mocks usadas nos testes.
- **mochawesome**: reporter para Mocha (gera relatórios HTML/JSON).
- **supertest**: asserções HTTP para testes do Express.
- **k6/x/faker**: geração de dados falsos para os scripts k6.
- **Mocha / Supertest**: testes funcionais (REST & GraphQL).
