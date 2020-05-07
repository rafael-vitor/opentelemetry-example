const { NodeTracerProvider } = require('@opentelemetry/node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');

// const provider = new NodeTracerProvider({ logLevel: 3, });
const provider = new NodeTracerProvider();

const serviceName = 'xesk';

exporter = new JaegerExporter({
  serviceName,
});

provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

provider.register();

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
