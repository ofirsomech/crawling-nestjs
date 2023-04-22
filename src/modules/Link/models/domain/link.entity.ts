import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  url: string;

  @Column()
  urlLink: string;

  @Column({
    length: 2048,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  text: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
