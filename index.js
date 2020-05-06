const { NodeTracerProvider } = require('@opentelemetry/node');
const provider = new NodeTracerProvider({
  logLevel: 3,
});

provider.register()

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
