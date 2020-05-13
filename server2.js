const { createTracer } = require('./tracer'); // needs to be done before modules are loaded;
createTracer('server-redis');

const express = require('express')
const { redis } = require('./setup-redis')

const app = express()
const port = 4000

async function setupRoutes() {
  const redisClient = await redis;
  
  app.get('/set', (req, res) => {
    if (!req.query) {
      res.status(400).send('No values provided');
      return;
    }

    console.log('args', req.query);
    const { key, value } = req.query

    redisClient.set(key, value)
  })

  app.get('/:key', (req, res) => {
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


setupRoutes().then(() => {
  app.listen(port);
  console.log(`Listening on http://localhost:${port}`);
});
