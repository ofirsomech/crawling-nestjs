import * as puppeteer from 'puppeteer';
import { Injectable } from '@nestjs/common';
import { AppLogger } from '../../../core/logger/logger';
import { Stylesheet } from '../models/domain/stylesheet.entity';
import { StylesheetRepository } from '../repositories/stylesheet.repository';

@Injectable()
export class StylesheetService {
  constructor(
    private readonly appLogger: AppLogger,
    private readonly stylesheetRepository: StylesheetRepository
  ) {}

  async crawlStylesheetsFromPage(url: string, page: puppeteer.Page) {
    await page.goto(url, { waitUntil: 'networkidle0' });

    const stylesheets = await page.evaluate(() => {
      const stylesheetList = [];
      for (const link of document.querySelectorAll('link')) {
        if (link.rel === 'stylesheet' && link.href) {
          stylesheetList.push(link.href);
        }
      }
      return stylesheetList;
    });

    const stylesheetEntities = stylesheets.map((stylesheet) => {
      const stylesheetEntity = new Stylesheet();
      stylesheetEntity.url = url;
      stylesheetEntity.stylesheet_url = stylesheet;
      return stylesheetEntity;
    });

    await Promise.all(
      stylesheetEntities.map((stylesheetEntity) =>
        this.stylesheetRepository.save(stylesheetEntity)
      )
    );

    this.appLogger.log(`Found ${stylesheets.length} stylesheets on the page`);

    return stylesheets;
  }

  async find() {
    return this.stylesheetRepository.find();
  }
}
