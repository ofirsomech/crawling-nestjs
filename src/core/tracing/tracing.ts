import {
  ConsoleSpanExporter,
  NodeTracerProvider,
} from '@opentelemetry/sdk-trace-node';
import * as opentelemetry from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

export function tracing(): void {
  const provider: NodeTracerProvider = new NodeTracerProvider();
  const SERVICE_NAME = process.env.SERVICE_NAME || 'example';
  provider.register();

  const traceExporter = new ConsoleSpanExporter();
  const sdk = new opentelemetry.NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: SERVICE_NAME,
    }),
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  // initialize the SDK and register with the OpenTelemetry API
  // this enables the API to record telemetry
  sdk
    .start()
    .then(() => console.log('Tracing initialized'))
    .catch((error) => console.log('Error initializing tracing', error));

  // gracefully shut down the SDK on process exit
  process.on('SIGTERM', () => {
    sdk
      .shutdown()
      .then(() => console.log('Tracing terminated'))
      .catch((error) => console.log('Error terminating tracing', error))
      .finally(() => process.exit(0));
  });
  provider.addSpanProcessor(
    new SimpleSpanProcessor(
      new JaegerExporter({
        // For Zipkin, use the following line instead:
        // new ZipkinExporter({
        endpoint: SERVICE_NAME,
      })
    )
  );
}
