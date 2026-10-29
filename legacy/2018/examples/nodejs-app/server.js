const SERVICE_PORT = process.env.SERVICE_PORT || 8080;
const express = require('express');
const app = express('app');

const foos = [
  { id: 1, description: 'Demo 1', done: false },
  { id: 2, description: 'Demo 2', done: false },
];

app.get('/api/todos', (req, res, next) => {
  res.send({
    total: foos.length,
    items: foos,
  });
});

process.on('SIGINT', shutdown);

const server = app.listen(SERVICE_PORT, () =>
  console.log(`Listen on ${server.address().SERVICE_PORT}`),
);

function shutdown() {
  console.log('Graceful shutdown ...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
}
