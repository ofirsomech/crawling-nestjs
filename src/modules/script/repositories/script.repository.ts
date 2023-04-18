import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Script } from '../models/domain/script.entity';

@Injectable()
export class ScriptRepository extends Repository<Script> {
  constructor(private readonly dataSource: DataSource) {
    super(Script, dataSource.createEntityManager());
  }
}
