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
