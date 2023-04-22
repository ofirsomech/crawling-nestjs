import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Screenshot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  url: string;

  @Column()
  fileName: string;

  @Column()
  downloadLink: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
