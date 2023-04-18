import { Injectable } from '@nestjs/common';
import { ScrapperService } from '../services/scrapper.service';
import { AppLogger } from '../../../core/logger/logger';

@Injectable()
export class ScrapperProvider {
  constructor(
    private readonly scrapperService: ScrapperService,
    private readonly appLogger: AppLogger
  ) {
    appLogger.setContext(`${this.constructor.name}`);
  }

  async crawlWebsite(url: string) {
    return this.scrapperService.crawlWebsite(url);
  }
}
