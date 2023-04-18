import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { NetworkRequest } from '../network-request/network-request';

export interface ApiCommunicationManagerService {
  exec<T, K>(networkRequest: NetworkRequest<T>): Observable<AxiosResponse<K>>;
}
