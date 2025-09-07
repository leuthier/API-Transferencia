
# API Testes - Express & GraphQL

API de exemplo para aprendizado de testes e automação (Mocha, Supertest, GraphQL)

## Pré-requisitos

- Node.js 14+

## Instalação

1. Instale dependências:
   ```sh
   npm install
   ```

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

## Banco de dados

- Em memória (array). Reiniciar a aplicação limpa os dados.

## Observações

- O arquivo `app.js` exporta o app sem fazer listen para facilitar testes com Supertest.
