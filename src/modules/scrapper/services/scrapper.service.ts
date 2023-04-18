import * as fs from 'node:fs';
import * as path from 'node:path';
import * as puppeteer from 'puppeteer';
import { EntityManager, Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { getRepositoryToken, InjectEntityManager } from '@nestjs/typeorm';
import { Script } from '../models/domain/script.entity';
import { AppLogger } from '../../../core/logger/logger';
import { Screenshot } from '../models/domain/screenshot.entity';
import { Stylesheet } from '../models/domain/stylesheet.entity';
import { LinkService } from '../../Link/services/link.service';

@Injectable()
export class ScrapperService {
  constructor(
    private readonly appLogger: AppLogger,
    private readonly linkService: LinkService,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @Inject(getRepositoryToken(Script))
    private readonly scriptRepository: Repository<Script>,
    @Inject(getRepositoryToken(Screenshot))
    private readonly screenshotRepository: Repository<Screenshot>,
    @Inject(getRepositoryToken(Stylesheet))
    private readonly stylesheetRepository: Repository<Stylesheet>
  ) {}

  async crawlWebsite(url: string) {
    const browser: puppeteer.Browser = await puppeteer.launch({
      headless: true,
    });
    const page: puppeteer.Page = await browser.newPage();

    const screenshot: string = await this.crawlScreenshot(url, page);
    const links = await this.linkService.crawlLinksFromPage(url, page);
    const stylesheets = await this.crawlStylesheetsFromPage(url, page);
    const scripts = await this.crawlScriptsFromPage(url, page);

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
    const screenshot = await this.screenshotRepository.find({
      where: { url: url },
    });
    const links = await this.linkService.find({
      where: { url: url },
    });
    const stylesheets = await this.stylesheetRepository.find({
      where: { url: url },
    });
    const scripts = await this.scriptRepository.find({
      where: { url: url },
    });

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

  async crawlScriptsFromPage(url: string, page: puppeteer.Page) {
    await page.goto(url, { waitUntil: 'networkidle0' });
    const scripts = await page.$$eval('script[src]', (scriptTags) =>
      scriptTags.map((script) => script.src)
    );
    const scriptEntities = scripts.map((script) => {
      const scriptEntity = new Script();
      scriptEntity.url = url;
      scriptEntity.script_url = script;
      return scriptEntity;
    });

    const promises = scriptEntities.map((scriptEntity) =>
      this.scriptRepository.save(scriptEntity)
    );

    await Promise.all(promises);

    this.appLogger.log(`Found ${scripts.length} scripts on the page`);

    return scripts;
  }

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

  async crawlScreenshot(url: string, page: puppeteer.Page) {
    await page.goto(url, { waitUntil: 'networkidle0' });
    const screenshot = await page.screenshot({
      fullPage: true,
      type: 'jpeg',
      quality: 50,
    });

    const screenshotEntity = new Screenshot();
    screenshotEntity.url = url;

    // Save the screenshot to a screenshots folder
    const screenshotFolder = path.join(__dirname, '..', 'screenshots');
    if (!fs.existsSync(screenshotFolder)) {
      fs.mkdirSync(screenshotFolder);
    }
    const fileName = `${Date.now()}.jpeg`;
    const screenshotPath = path.join(screenshotFolder, fileName);
    fs.writeFileSync(screenshotPath, screenshot);

    // Store the path in the Screenshot entity
    screenshotEntity.path = fileName;

    await this.screenshotRepository.save(screenshotEntity);

    this.appLogger.log(`Screenshot saved at ${screenshot}`);

    return screenshotPath;
  }
}
