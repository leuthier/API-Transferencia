const app = require('./app');

const PORT = process.env.BASE_PORT_REST || 3000;
app.listen(PORT, () => {
  console.log(`REST server running at http://localhost:${PORT}`);
});
