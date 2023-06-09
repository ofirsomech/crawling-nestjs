import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkModule } from '../link/link.module';
import { CoreModule } from '../../core/core.module';
import { ScriptModule } from '../script/script.module';
import { Link } from '../link/models/domain/link.entity';
import { ScrapperService } from './services/scrapper.service';
import { Script } from '../script/models/domain/script.entity';
import { ScrapperProvider } from './providers/scrapper.provider';
import { ScreenshotModule } from '../screenshot/screenshot.module';
import { StylesheetModule } from '../stylesheet/stylesheet.module';
import { LinkRepository } from '../link/repositories/link.repository';
import { Stylesheet } from '../stylesheet/models/domain/stylesheet.entity';
import { Screenshot } from '../screenshot/models/domain/screenshot.entity';
import { ScriptRepository } from '../script/repositories/script.repository';
import { ScrapperController } from './controllers/api/v1/scrapper.controller';
import { ScreenshotRepository } from '../screenshot/repositories/screenshot.repository';
import { StylesheetRepository } from '../stylesheet/repositories/stylesheet.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Link, LinkRepository]),
    TypeOrmModule.forFeature([Script, ScriptRepository]),
    TypeOrmModule.forFeature([Screenshot, ScreenshotRepository]),
    TypeOrmModule.forFeature([Stylesheet, StylesheetRepository]),
    CoreModule,
    LinkModule,
    ScriptModule,
    ScreenshotModule,
    StylesheetModule,
  ],
  controllers: [ScrapperController],
  providers: [ScrapperProvider, ScrapperService],
  exports: [ScrapperService],
})
export class ScrapperModule {}
