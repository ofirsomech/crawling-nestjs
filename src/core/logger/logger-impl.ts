import { Injectable, Scope } from '@nestjs/common';
import * as winston from 'winston';
import { format } from 'winston';
import { AppLogger } from './logger';
import { context as opentelemetryContext, Span } from '@opentelemetry/api';
import { getSpan } from '@opentelemetry/api/build/src/trace/context-utils';

const tracingFormat = () => {
  return format((meta) => {
    const span: Span | undefined = getSpan(opentelemetryContext.active());
    if (span) {
      const spanContext = span.spanContext();
      meta.traceId = spanContext.traceId;
      meta.spanId = spanContext.spanId;
    }
    return meta;
  })();
};

@Injectable({ scope: Scope.TRANSIENT })
export class AppLoggerImpl implements AppLogger {
  private logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'debug',
    defaultMeta: {
      context: 'NestJS',
      service: process.env.SERVICE_NAME || 'Unknown-Service',
    },
    format: winston.format.combine(winston.format.timestamp(), format.splat()),
    transports: [
      new winston.transports.Console({
        format: format.combine(
          format.colorize(),
          tracingFormat(),
          format.printf(
            ({ level, message, context, timestamp, traceId, spanId }) =>
              `${timestamp} [${context}] - [TraceId]: ${traceId}, [SpanId]: ${spanId}, [Level]: ${level}: [Message]: ${message}`
          )
        ),
      }),
    ],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(message: string, ...meta: any[]): void {
    this.logger.error(message, ...meta);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(message: string, ...meta: any[]): void {
    this.logger.info(message, ...meta);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(message: string, ...meta: any[]): void {
    this.logger.warn(message, ...meta);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(message: string, ...meta: any[]): void {
    this.logger.debug(message, ...meta);
  }

  setContext(context: string): void {
    this.logger.defaultMeta = { ...this.logger.defaultMeta, context };
  }
}
