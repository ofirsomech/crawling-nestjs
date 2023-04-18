import { Repository } from 'typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkModule } from '../Link/link.module';
import { CoreModule } from '../../core/core.module';
import { ScriptModule } from '../Script/script.module';
import { GuardModule } from '../../guards/guard.module';
import { Link } from '../Link/models/domain/link.entity';
import { ScrapperService } from './services/scrapper.service';
import { Screenshot } from './models/domain/screenshot.entity';
import { Stylesheet } from './models/domain/stylesheet.entity';
import { Script } from '../Script/models/domain/script.entity';
import { ScrapperProvider } from './providers/scrapper.provider';
import { LinkRepository } from '../Link/repositories/link.repository';
import { ScriptRepository } from '../Script/repositories/script.repository';
import { ScrapperController } from './controllers/api/v1/scrapper.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Link, LinkRepository]),
    TypeOrmModule.forFeature([Script, ScriptRepository]),
    TypeOrmModule.forFeature([Screenshot, Repository<Screenshot>]),
    TypeOrmModule.forFeature([Stylesheet, Repository<Stylesheet>]),
    CoreModule,
    GuardModule,
    LinkModule,
    ScriptModule,
  ],
  controllers: [ScrapperController],
  providers: [ScrapperProvider, ScrapperService],
  exports: [ScrapperService],
})
export class ScrapperModule {}
