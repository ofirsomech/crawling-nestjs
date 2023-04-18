import { Inject, Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { EntityManager, Repository } from 'typeorm';
import { Screenshot } from '../models/domain/screenshot.entity';
import { getRepositoryToken, InjectEntityManager } from '@nestjs/typeorm';
import { Link } from '../models/domain/link.entity';
import { Script } from '../models/domain/script.entity';
import { Stylesheet } from '../models/domain/stylesheet.entity';

@Injectable()
export class ScrapperService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @Inject(getRepositoryToken(Screenshot))
    private readonly screenshotRepository: Repository<Screenshot>,
    @Inject(getRepositoryToken(Link))
    private readonly linkRepository: Repository<Link>,
    @Inject(getRepositoryToken(Script))
    private readonly scriptRepository: Repository<Script>,
    @Inject(getRepositoryToken(Stylesheet))
    private readonly stylesheetRepository: Repository<Stylesheet>
  ) {}

  async crawlWebsite(url: string) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const screenshot = await this.getScreenshot(url, page);
    const links = await this.getLinksFromPage(url, page);
    const stylesheets = await this.getStylesheetsFromPage(url, page);
    const scripts = await this.getScriptsFromPage(url, page);

    await browser.close();
    return {
      screenshot: `Screenshot saved at ${screenshot}`,
      links: links.length,
      stylesheets: stylesheets.length,
      scripts: scripts.length,
    };
  }

  async getWebsiteData(url: string) {
    const screenshot = await this.screenshotRepository.find({
      where: { url: url },
    });
    const links = await this.linkRepository.find({
      where: { url: url },
    });
    const stylesheets = await this.stylesheetRepository.find({
      where: { url: url },
    });
    const scripts = await this.scriptRepository.find({
      where: { url: url },
    });

    return {
      screenshot,
      links,
      stylesheets,
      scripts,
    };
  }

  async getLinksFromPage(url: string, page: puppeteer.Page) {
    await page.goto(url, { waitUntil: 'networkidle0' });

    const links = await page.evaluate(
      (url) =>
        [...document.querySelectorAll('a')].map((link) => ({
          url: url,
          url_link: link.href,
          text: link.textContent.trim(),
        })),
      url
    );

    const savePromises = links.map(async (link) => {
      const linkEntity = new Link();
      linkEntity.url = link.url;
      linkEntity.url_link = link.url_link;
      linkEntity.text = link.text;

      try {
        await this.linkRepository.save(linkEntity);
      } catch (error) {
        console.error(`Error saving link: ${link.text}`, error);
      }
    });

    await Promise.all(savePromises);

    return links;
  }

  async getScriptsFromPage(url: string, page: puppeteer.Page) {
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

    return scripts;
  }

  async getStylesheetsFromPage(url: string, page: puppeteer.Page) {
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

    return stylesheets;
  }

  async getScreenshot(url: string, page: puppeteer.Page) {
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

    return screenshotPath;
  }
}
