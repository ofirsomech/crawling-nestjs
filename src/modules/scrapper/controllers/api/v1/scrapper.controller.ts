import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import { AppLogger } from '../../../../../core/logger/logger';
import { ScrapperProvider } from '../../../providers/scrapper.provider';

@ApiTags('Scrapper')
@Controller({ path: 'scrapper', version: '1' })
export class ScrapperController {
  constructor(
    private readonly appLogger: AppLogger,
    private readonly scrapperProvider: ScrapperProvider
  ) {
    appLogger.setContext(`${this.constructor.name}`);
  }

  @Get('crawl/:url')
  async crawlWebsite(@Param('url') url: string) {
    return this.scrapperProvider.crawlWebsite(url);
  }

  @Get('get-data/:url')
  async getWebsiteData(@Param('url') url: string) {
    return this.scrapperProvider.getWebsiteData(url);
  }
}
