import * as puppeteer from 'puppeteer';
import { Injectable } from '@nestjs/common';
import { Link } from '../models/domain/link.entity';
import { AppLogger } from '../../../core/logger/logger';
import { LinkRepository } from '../repositories/link.repository';

@Injectable()
export class LinkService {
  constructor(
    private readonly appLogger: AppLogger,
    private readonly linkRepository: LinkRepository
  ) {}

  async crawlLinksFromPage(pageUrl: string, page: puppeteer.Page) {
    await page.goto(pageUrl, { waitUntil: 'networkidle0' });

    const links = await page.evaluate(
      (url) =>
        [...document.querySelectorAll('a')].map((link) => ({
          url: url,
          url_link: link.href,
          text: link.textContent.trim(),
        })),
      pageUrl
    );

    const savePromises = links.map(async (link) => {
      const linkEntity = new Link();
      linkEntity.url = link.url;
      linkEntity.urlLink = link.url_link;
      linkEntity.text = link.text;

      try {
        console.log(linkEntity);
        await this.linkRepository.save(linkEntity);
      } catch (error) {
        this.appLogger.error(`Error saving link: ${link.text}`, error);
      }
    });

    await Promise.all(savePromises);

    this.appLogger.log(`Found ${links.length} links on the page`);

    return links;
  }

  async find() {
    return this.linkRepository.find();
  }
}
