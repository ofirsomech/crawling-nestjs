import { Example } from '../models/domain/example.entity';

export abstract class ExampleService {
  abstract getExamples(): Promise<Example[]>;

  abstract createExample(example: Example): Promise<Example>;
}
