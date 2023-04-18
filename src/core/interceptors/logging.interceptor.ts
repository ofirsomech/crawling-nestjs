import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppLogger } from '../logger/logger';

/**
 * Interceptor that logs input/output requests
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly appLogger: AppLogger) {
    appLogger.setContext(`${this.constructor.name}`);
  }

  private readonly ctxPrefix: string = LoggingInterceptor.name;

  /**
   * Intercept method, logs before and after the request being processed
   * @param context details about the current request
   * @param call$ implements the handle method that returns an Observable
   */
  public intercept(
    context: ExecutionContext,
    call$: CallHandler
  ): Observable<unknown> {
    const request: Request = context.switchToHttp().getRequest();
    const { method, url, body, headers } = request;
    const contextData = `${method} - ${url}`;
    const message = `Incoming request - ${method} - ${url}`;
    this.appLogger.debug(
      `Context Data: ${contextData}, message:${message}, method: ${method}, body: ${JSON.stringify(
        body
      )}, headers: ${JSON.stringify(headers)}`
    );

    return call$.handle().pipe(
      tap({
        next: (value: unknown): void => {
          this.logNext(value, context);
        },
        error: (error: Error): void => {
          this.logError(error, context);
        },
      })
    );
  }

  /**
   * Logs the request response in success cases
   * @param body body returned
   * @param context details about the current request
   */
  private logNext(body: unknown, context: ExecutionContext): void {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const response: Response = context.switchToHttp().getResponse<Response>();
    const { method, url } = request;
    const { statusCode } = response;
    const contextData = `${this.ctxPrefix} - ${statusCode} - ${method} - ${url}`;
    const message = `Outgoing response - ${statusCode} - ${method} - ${url}`;

    this.appLogger.debug(
      `Context Data: ${contextData}, message:${message}, body: ${JSON.stringify(
        body
      )}`
    );
  }

  /**
   * Logs the request response in success cases
   * @param error Error object
   * @param context details about the current request
   */
  private logError(error: Error, context: ExecutionContext): void {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const { method, url, body } = request;

    if (error instanceof HttpException) {
      const statusCode: number = error.getStatus();
      const contextData = `${this.ctxPrefix} - ${statusCode} - ${method} - ${url}`;
      const message = `Outgoing response - ${statusCode} - ${method} - ${url}`;

      if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
        this.appLogger.error(
          `Context Data: ${contextData}, method: ${method}, url: ${url}, body: ${JSON.stringify(
            body
          )}, message:${message}, error: ${error}, errorStack: ${error?.stack}`
        );
      } else {
        this.appLogger.warn(
          `Context Data: ${contextData}, method: ${method}, url: ${url}, body: ${JSON.stringify(
            body
          )}, message:${message}, error: ${error}}`
        );
      }
    } else {
      this.appLogger.error(
        `Outgoing response, method: ${method}, url: ${url}, errorStack: ${error?.stack}`
      );
    }
  }
}
