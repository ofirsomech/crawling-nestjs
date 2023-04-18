import { DataSource, Repository } from 'typeorm';
import { Example } from '../models/domain/example.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExampleRepository extends Repository<Example> {
  constructor(private readonly dataSource: DataSource) {
    super(Example, dataSource.createEntityManager());
  }
}
