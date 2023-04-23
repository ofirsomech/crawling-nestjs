import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Link } from '../models/domain/link.entity';

@Injectable()
export class LinkRepository extends Repository<Link> {
  constructor(private readonly dataSource: DataSource) {
    super(Link, dataSource.createEntityManager());
  }
}
