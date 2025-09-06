# API GraphQL

## Como rodar

1. Instale as dependências:
  ```sh
  npm install -D apollo-server-express express graphql jsonwebtoken
  ```
2. Execute o servidor:
   ```sh
   node graphql/server.js
   ```
3. Acesse o playground GraphQL em: [http://localhost:4000/graphql](http://localhost:4000/graphql)

## Autenticação
- Para mutations de transferência, envie o JWT no header:
  ```
  { "Authorization": "Bearer <token>" }
  ```
- O token é obtido via mutation `login`.

## Estrutura dos arquivos
- `app.js`: Configuração do ApolloServer e Express (sem listen)
- `server.js`: Inicializa o servidor
- `schema.js`: Types e operações GraphQL
- `resolvers.js`: Implementação das queries e mutations
- `auth.js`: Middleware de autenticação JWT para GraphQL

## Mutations
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
## Queries
```graphql
query queryUsers {
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