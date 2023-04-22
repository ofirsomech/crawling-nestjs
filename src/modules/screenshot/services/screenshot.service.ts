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

  async crawlScreenshot(
    url: string,
    page: puppeteer.Page,
    dockerEnvironment: boolean
  ): Promise<string> {
    const baseUrl = 'http://localhost:8081';
    await page.goto(url, { waitUntil: 'networkidle0' });
    const screenshot = await page.screenshot({
      fullPage: true,
      type: 'jpeg',
      quality: 30,
    });

    const screenshotEntity = new Screenshot();
    screenshotEntity.url = url;

    // Save the screenshot to a screenshots folder
    const screenshotFolder = dockerEnvironment
      ? '/usr/screenshots'
      : path.join(__dirname, '../../../', 'screenshots');
    if (!fs.existsSync(screenshotFolder)) {
      fs.mkdirSync(screenshotFolder);
    }
    const fileName = `${Date.now()}.jpeg`;
    const screenshotPath = path.join(screenshotFolder, fileName);
    fs.writeFileSync(screenshotPath, screenshot);

    const downloadLink = `${baseUrl}/api/screenshot/${fileName}`;

    // Store the path in the Screenshot entity
    screenshotEntity.fileName = fileName;
    screenshotEntity.downloadLink = downloadLink;

    await this.screenshotRepository.save(screenshotEntity);

    this.appLogger.log(`Screenshot saved at ${screenshotPath}`);

    return downloadLink;
  }

  async find() {
    return this.screenshotRepository.find();
  }
}
