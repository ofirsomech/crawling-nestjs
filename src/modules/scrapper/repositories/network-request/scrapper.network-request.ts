import { HttpRequestMethods } from '../../../../core/api-communication-manager/enums/http-request-methods.enum';
import { NetworkRequest } from '../../../../core/api-communication-manager/network-request/network-request';

export class ScrapperNetworkRequest extends NetworkRequest<void> {
  getRequestMethod(): HttpRequestMethods {
    return HttpRequestMethods.GET;
  }

  getUrl(): string {
    // Todo replace with global const base domain in your real repository
    const exampleBaseUrl = `http://localhost:${process.env.PORT}`;
    return `${exampleBaseUrl}/api/v1/example`;
  }
}
