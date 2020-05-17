const opentelemetry = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');

const createTracer = (serviceName) => {
  const provider = new NodeTracerProvider();
  exporter = new JaegerExporter({ serviceName });
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
  provider.register();

  return opentelemetry.trace.getTracer(serviceName)
}


module.exports = {
  createTracer,
}
