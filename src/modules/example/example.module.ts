import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Example } from './models/domain/example.entity';
import { ExampleRepository } from './repositories/example.repository';
import { ExampleV1Controller } from './controllers/api/v1/example-v1.controller';
import { ExampleProvider } from './providers/example.provider';
import { ExampleImplService } from './services/example-impl.service';
import { ExampleService } from './services/example.service';
import { ExampleHttpRepository } from './repositories/example-http.repository';
import { CoreModule } from '../../core/core.module';
import { GuardModule } from '../../guards/guard.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Example, ExampleRepository]),
    CoreModule,
    GuardModule,
  ],
  controllers: [ExampleV1Controller],
  providers: [
    ExampleProvider,
    ExampleRepository,
    ExampleHttpRepository,
    {
      provide: ExampleService,
      useClass: ExampleImplService,
    },
  ],
  exports: [],
})
export class ExampleModule {}
