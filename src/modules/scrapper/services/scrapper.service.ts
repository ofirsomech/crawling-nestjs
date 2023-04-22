import * as puppeteer from 'puppeteer';
import { Injectable } from '@nestjs/common';
import { AppLogger } from '../../../core/logger/logger';
import { LinkService } from '../../Link/services/link.service';
import { ScriptService } from '../../script/services/script.service';
import { ScreenshotService } from '../../screenshot/services/screenshot.service';
import { StylesheetService } from '../../stylesheet/services/stylesheet.service';

@Injectable()
export class ScrapperService {
  constructor(
    private readonly appLogger: AppLogger,
    private readonly linkService: LinkService,
    private readonly scriptService: ScriptService,
    private readonly screenshotService: ScreenshotService,
    private readonly stylesheetService: StylesheetService
  ) {}

  async crawlWebsite(url: string) {
    const browser: puppeteer.Browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page: puppeteer.Page = await browser.newPage();

    const screenshot: string = await this.screenshotService.crawlScreenshot(
      url,
      page
    );
    const links = await this.linkService.crawlLinksFromPage(url, page);
    const stylesheets = await this.stylesheetService.crawlStylesheetsFromPage(
      url,
      page
    );
    const scripts = await this.scriptService.crawlScriptsFromPage(url, page);

    await browser.close();
    this.appLogger.log(`Crawled website: ${url}`);

    return {
      screenshot: `Screenshot saved at ${screenshot}`,
      links: links.length,
      stylesheets: stylesheets.length,
      scripts: scripts.length,
    };
  }

  async getWebsiteData(url: string) {
    this.appLogger.log(`Getting website data: ${url}`);

    const websiteData = {};

    // Fetch website data
    const screenshot = await this.screenshotService.find(url);
    const links = await this.linkService.find(url);
    const stylesheets = await this.stylesheetService.find(url);
    const scripts = await this.scriptService.find(url);

    // Group website data by date
    for (const item of [...screenshot, ...links, ...stylesheets, ...scripts]) {
      const date = new Date(item.createdAt).toLocaleDateString('en-GB');
      if (!websiteData[date]) {
        websiteData[date] = [];
      }
      websiteData[date].push(item);
    }

    this.appLogger.log(`Got website data: ${url}`);

    return websiteData;
  }
}
