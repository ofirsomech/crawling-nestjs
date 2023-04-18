import { Observable } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { catchError, map, tap } from 'rxjs/operators';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiManagerUtil } from '../utils/api-manager.util';
import { NetworkRequest } from '../network-request/network-request';
import { AppConfigService } from '../../../config/app-config.service';
import { HttpRequestMethods } from '../enums/http-request-methods.enum';
import { ApiCommunicationManagerService } from './api-communication-manager.service';
import { AppLogger } from '../../logger/logger';

@Injectable()
export class ApiCommunicationManagerImplService
  implements ApiCommunicationManagerService
{
  protected headers: Map<string, string>;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: AppConfigService,
    private readonly logger: AppLogger
  ) {
    logger.setContext(`${this.constructor.name}`);
  }

  public exec<T, K>(networkRequest: NetworkRequest<T>): Observable<K> {
    const method = networkRequest.getRequestMethod();
    const url = networkRequest.getUrl();
    const headers = ApiManagerUtil.mapToObject(networkRequest.getHeaders());
    const body = networkRequest.getBody();
    const parameters = ApiManagerUtil.mapToObject(
      networkRequest.getQueryParams()
    );

    const requestConfig: AxiosRequestConfig = {
      url,
      headers,
      params: parameters,
      method,
      data: body,
    };

    if (method === HttpRequestMethods.GET || !requestConfig?.data) {
      delete requestConfig.data;
    }
    this.logger.debug(`Http request: ${JSON.stringify(requestConfig)}`);
    return this.httpService.request(requestConfig).pipe(
      tap((response) =>
        this.logger.debug(`Http response: ${JSON.stringify(response)}`)
      ),
      map((response: AxiosResponse<K>) => response.data),
      catchError((error) => {
        console.error(`Http error ${JSON.stringify(error)}`);
        throw error.response
          ? new HttpException(
              this.getErrorMessage(error.response),
              error.response.status
            )
          : new InternalServerErrorException('Communication unavailable!');
      })
    );
  }

  private getErrorMessage(response): string {
    if (response && response.data && response.data.error) {
      //check if error is an object
      if (typeof response.data.error === 'object') {
        //check if object is an array
        if (
          response.data.error?.message &&
          Array.isArray(response.data.error.message) &&
          [...response.data.error.message].length > 0
        ) {
          return [...response.data.error.message].map((x) => x).join(',');
        }
        return response.data.error;
      }
      return response.data.error;
    }
    return response.data.message;
  }
}
