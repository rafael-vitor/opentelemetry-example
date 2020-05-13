const opentelemetry = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');

// const provider = new NodeTracerProvider({ logLevel: 3, });
const createTracer = (serviceName) => {
  const provider = new NodeTracerProvider();

  // const serviceName = 'xesk-redis';

  exporter = new JaegerExporter({
    serviceName,
  });

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  provider.register();
}

module.exports = {
  createTracer,
}
