const { createTracer } = require('./tracer'); // needs to be done before modules are loaded;
const tracer = createTracer('server-redis');

const express = require('express')
const Redis = require("ioredis");
const cluster = require('express-cluster');
console.log(process.env.REDIS_HOST);
const redis = new Redis(process.env.REDIS_HOST || 'localhost');

const app = express()
const port = 4000


cluster(function(worker) {
  function setupRoutes() {
    const redisClient = redis;
    
    app.get('/set', (req, res) => {
      if (!req.query) {
        res.status(400).send('No values provided');
        return;
      }

      console.log('args', req.query);
      const { key, value } = req.query

      redisClient.set(key, value, (err, reply) => res.status(200).send(reply.toString()))
    })

    app.get('/:key', (req, res) => {
      tracer.getCurrentSpan().setAttribute('worker-id', worker.id);
      const { key } = req.params;
      redisClient.get(key, (err, result) => {
        if (err) {
          res.status(400).send(result);
          throw err;
        }
        console.log(result);
        res.status(200).send(result);
      });
    })
  };


  setupRoutes();
  console.log(`Listening on http://localhost:${port}`);
  return app.listen(port);
}, {count: 1})
