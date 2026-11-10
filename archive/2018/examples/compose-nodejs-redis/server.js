const SERVICE_PORT = process.env.SERVICE_PORT || 8080;
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || '6379';

const express = require('express');
const redis = require('redis');
const app = express();
const client = redis.createClient(REDIS_PORT, REDIS_HOST);

client.on('error', err => {
  console.error(`Redis connection error.\n${err.message}`);
  process.exit(1);
});

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/redis', (req, res, next) => {
  client.get('foo', (error, result) => {
    if (error) return next(error);
    res.send(result);
  });
});

app.post('/redis', (req, res, next) => {
  client.set('foo', 'bar', (error, result) => {
    if (error) return next(error);
    res.status(201).send('done');
  });
});

process.on('SIGINT', () => {
  console.log(`Graceful shutdown!`);
  server.close(() => {
    client.quit(() => {
      console.log(`Shutdown`);
      process.exit(0);
    });
  });
});

const server = app.listen(SERVICE_PORT, () =>
  console.log(`Listen on ${server.address().port}`),
);
