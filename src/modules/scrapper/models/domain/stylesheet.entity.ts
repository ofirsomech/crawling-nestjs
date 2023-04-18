import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Stylesheet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({ length: 2048 })
  stylesheet_url: string;
}
