import * as puppeteer from 'puppeteer';
import { Injectable } from '@nestjs/common';
import { addToAllScansData } from '../utils/utils';
import { AppLogger } from '../../../core/logger/logger';
import { LinkService } from '../../Link/services/link.service';
import { ScriptService } from '../../script/services/script.service';
import { AppConfigService } from '../../../config/app-config.service';
import { ScreenshotService } from '../../screenshot/services/screenshot.service';
import { StylesheetService } from '../../stylesheet/services/stylesheet.service';

@Injectable()
export class ScrapperService {
  constructor(
    private readonly appLogger: AppLogger,
    private readonly appConfigService: AppConfigService,
    private readonly linkService: LinkService,
    private readonly scriptService: ScriptService,
    private readonly screenshotService: ScreenshotService,
    private readonly stylesheetService: StylesheetService
  ) {}

  async crawlWebsite(url: string) {
    const start = Date.now(); // Record the start time

    const dockerEnvironment = this.appConfigService.isDocker;

    const browser: puppeteer.Browser = await puppeteer.launch(
      dockerEnvironment
        ? {
            executablePath: '/usr/bin/chromium-browser',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
          }
        : {}
    );
    const page: puppeteer.Page = await browser.newPage();

    const timeout = 60_000;
    await page.goto(url, { waitUntil: 'networkidle0', timeout });

    const screenshot: string = await this.screenshotService.crawlScreenshot(
      url,
      page,
      dockerEnvironment
    );
    const links = await this.linkService.crawlLinksFromPage(url, page);
    const stylesheets = await this.stylesheetService.crawlStylesheetsFromPage(
      url,
      page
    );
    const scripts = await this.scriptService.crawlScriptsFromPage(url, page);

    await browser.close();

    const end = Date.now(); // Record the end time
    const duration = end - start; // Calculate the duration in milliseconds
    const durationInSeconds = (duration / 1000).toFixed(3); // Calculate the duration in seconds with 3 decimal places

    this.appLogger.log(`Crawled website: ${url} in ${durationInSeconds}s`);

    return {
      screenshot: screenshot,
      links: links.length,
      stylesheets: stylesheets.length,
      scripts: scripts.length,
      duration: `${durationInSeconds}s`, // Include the duration in seconds with the format ss:ms in the response
    };
  }

  async getAllScansData() {
    const allScansData = {};

    const allScreenshots = await this.screenshotService.find();
    const allLinks = await this.linkService.find();
    const allStylesheets = await this.stylesheetService.find();
    const allScripts = await this.scriptService.find();

    for (const item of allScreenshots) {
      addToAllScansData(allScansData, item, 'screenshots');
    }
    for (const item of allLinks) {
      addToAllScansData(allScansData, item, 'links');
    }
    for (const item of allStylesheets) {
      addToAllScansData(allScansData, item, 'stylesheets');
    }
    for (const item of allScripts) {
      addToAllScansData(allScansData, item, 'scripts');
    }

    return allScansData;
  }
}
