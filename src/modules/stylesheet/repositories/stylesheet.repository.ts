import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Stylesheet } from '../models/domain/stylesheet.entity';

@Injectable()
export class StylesheetRepository extends Repository<Stylesheet> {
  constructor(private readonly dataSource: DataSource) {
    super(Stylesheet, dataSource.createEntityManager());
  }
}
