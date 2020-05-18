const opentelemetry = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');

const createTracer = (serviceName) => {
  const provider = new NodeTracerProvider();
  /** @type {ExporterConfig} */
  exporter = new JaegerExporter({
    serviceName,
    host: 'jaeger'
  });
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
  provider.register();

  return opentelemetry.trace.getTracer(serviceName)
}


module.exports = {
  createTracer,
}
