import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Example } from './models/domain/scrapper.entity';
import { ScrapperRepository } from './repositories/scrapper.repository';
import { ScrapperController } from './controllers/api/v1/scrapper.controller';
import { ScrapperProvider } from './providers/scrapper.provider';
import { ScrapperService } from './services/scrapper.service';
import { ScrapperHttpRepository } from './repositories/scrapper-http.repository';
import { CoreModule } from '../../core/core.module';
import { GuardModule } from '../../guards/guard.module';
import { Screenshot } from './models/domain/screenshot.entity';
import { Repository } from 'typeorm';
import { Link } from './models/domain/link.entity';
import { Script } from './models/domain/script.entity';
import { Stylesheet } from './models/domain/stylesheet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Example, ScrapperRepository]),
    TypeOrmModule.forFeature([Screenshot, Repository<Screenshot>]),
    TypeOrmModule.forFeature([Link, Repository<Link>]),
    TypeOrmModule.forFeature([Script, Repository<Script>]),
    TypeOrmModule.forFeature([Stylesheet, Repository<Stylesheet>]),
    CoreModule,
    GuardModule,
  ],
  controllers: [ScrapperController],
  providers: [
    ScrapperProvider,
    ScrapperRepository,
    ScrapperHttpRepository,
    ScrapperService,
  ],
  exports: [ScrapperService],
})
export class ScrapperModule {}
