import { Repository } from 'typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkModule } from '../Link/link.module';
import { CoreModule } from '../../core/core.module';
import { Script } from './models/domain/script.entity';
import { GuardModule } from '../../guards/guard.module';
import { ScrapperService } from './services/scrapper.service';
import { Screenshot } from './models/domain/screenshot.entity';
import { Stylesheet } from './models/domain/stylesheet.entity';
import { ScrapperProvider } from './providers/scrapper.provider';
import { ScrapperController } from './controllers/api/v1/scrapper.controller';
import { LinkRepository } from '../Link/repositories/link.repository';
import { Link } from '../Link/models/domain/link.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Link, LinkRepository]),
    TypeOrmModule.forFeature([Screenshot, Repository<Screenshot>]),
    TypeOrmModule.forFeature([Script, Repository<Script>]),
    TypeOrmModule.forFeature([Stylesheet, Repository<Stylesheet>]),
    CoreModule,
    GuardModule,
    LinkModule,
  ],
  controllers: [ScrapperController],
  providers: [ScrapperProvider, ScrapperService],
  exports: [ScrapperService],
})
export class ScrapperModule {}
