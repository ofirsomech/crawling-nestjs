import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Screenshot } from '../models/domain/screenshot.entity';

@Injectable()
export class ScreenshotRepository extends Repository<Screenshot> {
  constructor(private readonly dataSource: DataSource) {
    super(Screenshot, dataSource.createEntityManager());
  }
}
