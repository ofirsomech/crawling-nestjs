import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import { AppLogger } from '../../../../../core/logger/logger';
import { ScrapperProvider } from '../../../providers/scrapper.provider';
import { ScrapperService } from '../../../services/scrapper.service';

@ApiTags('Scrapper')
@Controller({ path: 'scrapper', version: '1' })
export class ScrapperController {
  constructor(
    private readonly scrapperProvider: ScrapperProvider,
    private readonly scrapperService: ScrapperService,
    private readonly appLogger: AppLogger
  ) {
    appLogger.setContext(`${this.constructor.name}`);
  }

  @Get('crawl/:url')
  async crawlWebsite(@Param('url') url: string) {
    return this.scrapperProvider.crawlWebsite(url);
  }

  @Get('get-data/:url')
  async getWebsiteData(@Param('url') url: string) {
    return this.scrapperService.getWebsiteData(url);
  }
}
