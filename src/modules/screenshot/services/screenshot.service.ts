import * as fs from 'node:fs';
import * as path from 'node:path';
import * as puppeteer from 'puppeteer';
import { Injectable } from '@nestjs/common';
import { AppLogger } from '../../../core/logger/logger';
import { Screenshot } from '../models/domain/screenshot.entity';
import { ScreenshotRepository } from '../repositories/screenshot.repository';

@Injectable()
export class ScreenshotService {
  constructor(
    private readonly appLogger: AppLogger,
    private readonly screenshotRepository: ScreenshotRepository
  ) {}

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

  async find(url) {
    return this.screenshotRepository.find({
      where: { url: url },
    });
  }
}
