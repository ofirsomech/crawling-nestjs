import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppLogger } from '../../../core/logger/logger';
import { ScreenshotService } from '../services/screenshot.service';
import { Response } from 'express';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { AppConfigService } from '../../../config/app-config.service';

@ApiTags('Screenshot')
@Controller({ path: 'screenshot' })
export class ScreenshotController {
  constructor(
    private readonly appLogger: AppLogger,
    private readonly screenshotService: ScreenshotService,
    private readonly appConfigService: AppConfigService
  ) {
    appLogger.setContext(`${this.constructor.name}`);
  }

  @Get(':filename')
  async downloadScreenshot(
    @Param('filename') fileName: string,
    @Res() res: Response
  ) {
    const dockerEnvironment = this.appConfigService.isDocker;
    const screenshotFolder = dockerEnvironment
      ? '/usr/screenshots'
      : path.join(__dirname, '../../../', 'screenshots');
    const screenshotPath = path.join(screenshotFolder, fileName);

    if (!fs.existsSync(screenshotPath)) {
      return res.status(404).send('File not found');
    }

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    fs.createReadStream(screenshotPath).pipe(res);
  }
}
