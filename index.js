const { tracer } = require('./tracer'); // needs to be done before modules are loaded;

const express = require('express')
const { redis } = require('./setup-redis')

const app = express()
const port = 3000

async function setupRoutes() {
  const redisClient = await redis;
  
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
  
  app.get('/set', (req, res) => {
    if (!req.query) {
      res.status(400).send('No values provided');
      return;
    }

    console.log('args', req.query);
    const { key, value } = req.query

    redisClient.set(key, value)
  })
};


setupRoutes().then(() => {
  app.listen(port);
  console.log(`Listening on http://localhost:${port}`);
});
