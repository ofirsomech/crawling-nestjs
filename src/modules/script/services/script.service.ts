import * as puppeteer from 'puppeteer';
import { Injectable } from '@nestjs/common';
import { Script } from '../models/domain/script.entity';
import { AppLogger } from '../../../core/logger/logger';
import { ScriptRepository } from '../repositories/script.repository';

@Injectable()
export class ScriptService {
  constructor(
    private readonly appLogger: AppLogger,
    private readonly scriptRepository: ScriptRepository
  ) {}

  async crawlScriptsFromPage(url: string, page: puppeteer.Page) {
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

  async find() {
    return this.scriptRepository.find();
  }
}
