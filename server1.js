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

const values = ['key1', 'key2', 'key3']

async function setupRoutes() {
  app.get('/', async (_, res) => {
    const resultList = await Promise.all(
      values.map(v => httpRequest('localhost', 4000, '/' + v))
    )

    console.log({ resultList });
    res.status(200).send(resultList.toString());
  })

  app.get('/get-sync', async (_, res) => {
    let resultList = [];
    let result;

    for (let i = 0; i < values.length; i++) {
      result = await httpRequest('localhost', 4000, '/' + values[i])
      resultList.push(result);
    }

    console.log({ resultList });
    res.status(200).send(resultList.toString());
  })
  
  app.get('/set-values', async (_, res) => {
    const testItens = [
      { key: 'key1', value: 'value1' },
      { key: 'key2', value: 'value2' },
      { key: 'key3', value: 'value3' },
    ]

    await Promise.all(
      testItens.map(i => httpRequest('localhost', 4000, `/set?key=${i.key}&value=${i.value}`))
    ).then((result) => {
      res.status(200).send(result.toString());
    })
    
  })
};


setupRoutes().then(() => {
  app.listen(port);
  console.log(`Listening on http://localhost:${port}`);
});
