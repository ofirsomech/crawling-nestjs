import { Injectable } from '@nestjs/common';
import { AppLogger } from '../../../core/logger/logger';
import { ApiCommunicationManagerImplService } from '../../../core/api-communication-manager/services/api-communication-manager-impl.service';
import { ScrapperNetworkRequest } from './network-request/scrapper.network-request';
import { Example } from '../models/domain/scrapper.entity';
import { Observable } from 'rxjs';

@Injectable()
export class ScrapperHttpRepository {
  constructor(
    private readonly appLogger: AppLogger,
    private readonly apiCommunicationManager: ApiCommunicationManagerImplService
  ) {
    appLogger.setContext(`${this.constructor.name}`);
  }

  getExamples(): Observable<Example[]> {
    const networkRequest = new ScrapperNetworkRequest();
    return this.apiCommunicationManager.exec<void, Example[]>(networkRequest);
  }
}
