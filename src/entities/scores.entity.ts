import { User } from '../entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Scores {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  scores: number;

  @Column({ default: new Date() })
  createdAt: string;

  @Column({ default: new Date() })
  updatedAt: string;

  @ManyToOne(() => User, (user) => user.scores)
  user: User;
}
