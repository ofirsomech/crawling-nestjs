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
    // const browser: puppeteer.Browser = await puppeteer.launch({
    //   executablePath: '/usr/bin/chromium-browser',
    //   args: ['--no-sandbox', '--disable-setuid-sandbox'],
    // });
    const browser: puppeteer.Browser = await puppeteer.launch();
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

  async getAllScansData() {
    const allScansData = {};

    const allScreenshots = await this.screenshotService.find();
    const allLinks = await this.linkService.find();
    const allStylesheets = await this.stylesheetService.find();
    const allScripts = await this.scriptService.find();

    for (const item of allScreenshots) {
      this.addToAllScansData(allScansData, item, 'screenshots');
    }
    for (const item of allLinks) {
      this.addToAllScansData(allScansData, item, 'links');
    }
    for (const item of allStylesheets) {
      this.addToAllScansData(allScansData, item, 'stylesheets');
    }
    for (const item of allScripts) {
      this.addToAllScansData(allScansData, item, 'scripts');
    }

    return allScansData;
  }

  addToAllScansData(allScansData, item, type) {
    const website = item.url;
    const date = new Date(item.createdAt).toLocaleDateString('en-GB', {
      timeZone: 'UTC',
    });

    if (!allScansData[website]) {
      allScansData[website] = {};
    }

    if (!allScansData[website][date]) {
      allScansData[website][date] = {};
    }

    if (!allScansData[website][date][type]) {
      allScansData[website][date][type] = [];
    }

    allScansData[website][date][type].push(item);
  }
}
