import * as fs from 'node:fs';
import * as path from 'node:path';

export function getScreenshotPath(fileName: string): string {
  const dockerEnvironment = this.appConfigService.isDocker;
  const screenshotFolder = dockerEnvironment
    ? '/usr/screenshots'
    : path.join(__dirname, '../../../', 'screenshots');
  const screenshotPath = path.join(screenshotFolder, fileName);

  if (!fs.existsSync(screenshotPath)) {
    return null;
  }

  return screenshotPath;
}

export function setResponseHeaders(res: any, fileName: string) {
  res.setHeader('Content-Type', 'image/jpeg');
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
}
