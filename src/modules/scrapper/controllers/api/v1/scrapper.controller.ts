import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppLogger } from '../../../../../core/logger/logger';
import { ScrapperProvider } from '../../../providers/scrapper.provider';
import { ScrapperRequestDto } from '../../../models/crawl.request';

@ApiTags('Scrapper')
@Controller({ path: 'scrapper', version: '1' })
export class ScrapperController {
  constructor(
    private readonly appLogger: AppLogger,
    private readonly scrapperProvider: ScrapperProvider
  ) {
    appLogger.setContext(`${this.constructor.name}`);
  }

  @Post('crawl')
  async crawlWebsite(@Body() dto: ScrapperRequestDto) {
    return this.scrapperProvider.crawlWebsite(dto.url);
  }

  @Get('getAllScansData')
  async getAllScansData() {
    return this.scrapperProvider.getAllScansData();
  }
}
