import { Injectable } from '@nestjs/common';
import { ExampleRepository } from '../repositories/example.repository';
import { Example } from '../models/domain/example.entity';
import { AppLogger } from '../../../core/logger/logger';
import { ExampleService } from './example.service';

@Injectable()
export class ExampleImplService implements ExampleService {
  constructor(
    private readonly exampleRepository: ExampleRepository,
    private readonly appLogger: AppLogger
  ) {
    appLogger.setContext(`${this.constructor.name}`);
  }

  public async getExamples(): Promise<Example[]> {
    return this.exampleRepository.find();
  }

  public async createExample(example: Example): Promise<Example> {
    return this.exampleRepository.save(example);
  }
}
