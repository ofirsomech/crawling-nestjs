import { Injectable } from '@nestjs/common';
import { AppLogger } from '../../../core/logger/logger';
import { ApiCommunicationManagerImplService } from '../../../core/api-communication-manager/services/api-communication-manager-impl.service';
import { ExampleNetworkRequest } from './network-request/example.network-request';
import { Example } from '../models/domain/example.entity';
import { Observable } from 'rxjs';

@Injectable()
export class ExampleHttpRepository {
  constructor(
    private readonly appLogger: AppLogger,
    private readonly apiCommunicationManager: ApiCommunicationManagerImplService
  ) {
    appLogger.setContext(`${this.constructor.name}`);
  }

  getExamples(): Observable<Example[]> {
    const networkRequest = new ExampleNetworkRequest();
    return this.apiCommunicationManager.exec<void, Example[]>(networkRequest);
  }
}
