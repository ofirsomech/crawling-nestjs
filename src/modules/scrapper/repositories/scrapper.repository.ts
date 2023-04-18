import { DataSource, Repository } from 'typeorm';
import { Example } from '../models/domain/scrapper.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ScrapperRepository extends Repository<Example> {
  constructor(private readonly dataSource: DataSource) {
    super(Example, dataSource.createEntityManager());
  }
}
