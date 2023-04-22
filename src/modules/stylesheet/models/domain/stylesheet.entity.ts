import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Stylesheet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({ length: 2048 })
  stylesheet_url: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
