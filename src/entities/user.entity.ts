import { Scores } from '../entities/scores.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 25, unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 50 })
  password: string;

  @Column()
  role: string;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => Scores, (score) => score.user)
  scores: Scores[];

  @Column({ default: new Date() })
  createdAt: string;

  @Column({ default: new Date() })
  updatedAt: string;
}
