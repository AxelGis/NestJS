import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Scores } from '../entities/scores.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Scores)
    private scoresRepository: Repository<Scores>,
  ) {}

  /**
   * Find user by id
   * @param id
   * @returns
   */
  async findById(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: {
        id,
      },
      select: {
        username: true,
        email: true,
        role: true,
      },
    });
  }

  /**
   * Find user by email
   * @param email
   * @returns
   */
  async findOne(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  /**
   * Create new user
   * @param username
   * @param email
   * @param password
   * @param role
   * @returns
   */
  async create(
    username: string,
    email: string,
    password: string,
    role: string = 'user',
  ): Promise<User> {
    const newUser: User = this.usersRepository.create({
      username,
      email,
      password,
      role,
    });

    return this.usersRepository.save(newUser);
  }

  /**
   * Add scores
   * @param userId
   * @param username
   * @param scores
   * @returns
   */
  async addScores(
    userId: number,
    username: string,
    scores: number,
  ): Promise<Scores> {
    const currentUser = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (
      !currentUser ||
      (currentUser.username !== username && currentUser.role !== 'admin')
    ) {
      throw new BadRequestException('Invalid user');
    }

    const scoresUser = await this.usersRepository.findOne({
      where: {
        username,
      },
    });

    const newScores: Scores = this.scoresRepository.create({
      scores,
      user: {
        id: scoresUser.id,
      },
    });

    return this.scoresRepository.save(newScores);
  }

  /**
   * Return leaderboard
   * @returns
   */
  async leaderboard(): Promise<any> {
    const query = this.scoresRepository
      .createQueryBuilder('score')
      .select('MAX(score.scores)', 'max_scores')
      .addSelect('user.username', 'username')
      .innerJoin(User, 'user', 'user.id = score.user')
      .orderBy('max_scores', 'DESC')
      .groupBy('username');

    const result = await query.getRawMany();

    return result;
  }
}
