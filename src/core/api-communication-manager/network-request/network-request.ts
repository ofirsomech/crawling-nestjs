import { HttpRequestMethods } from '../enums/http-request-methods.enum';

export abstract class NetworkRequest<T> {
  protected TAG = `${this.constructor.name}`;

  protected headers: Map<string, string>;

  protected accessToken: string;

  public abstract getRequestMethod(): HttpRequestMethods;

  public abstract getUrl(): string;

  public getBody(): T {
    return null;
  }

  public getQueryParams(): Map<string, any> | undefined {
    return undefined;
  }

  public getHeaders(): Map<string, string> {
    const headers: Map<string, string> = new Map();
    headers.set('Content-Type', 'application/json');
    return headers;
  }
}
