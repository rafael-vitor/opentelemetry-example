const { createTracer } = require('./tracer'); // needs to be done before modules are loaded;
createTracer('api');

const express = require('express')
const http = require('http');

const app = express()
const port = 3000

const httpRequest = (host, port, path) => {
  return new Promise((resolve, reject) => {
    http.get({
      host,
      port,
      path,
    }, (response) => {
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => {
        console.log(body.toString());
        resolve(body);
      });
    });
  })
}

async function setupRoutes() {
  app.get('/', async (_, res) => {
    const values = ['test1', 'test2', 'test3', 'test4', 'test5'];

    // let resultList = [];
    // let result;

    // for (let i = 0; i < values.length; i++) {
    //   result = await httpRequest('localhost', 4000, '/' + values[i])
    //   resultList.push(result);
    // }
    
    const resultList = await Promise.all(
      values.map(v => httpRequest('localhost', 4000, '/' + v))
    )

    console.log({ resultList });
    res.status(200).send(resultList + 'ok');
  })
};


setupRoutes().then(() => {
  app.listen(port);
  console.log(`Listening on http://localhost:${port}`);
});
