const app = require('./app');
const PORT = process.env.BASE_PORT_GRAPHQL || 4000;

app.listen(PORT, () => {
  console.log(`GraphQL server running at http://localhost:${PORT}/graphql`);
});
