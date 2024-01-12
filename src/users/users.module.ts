import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { User } from '../entities/user.entity';
import { Scores } from '../entities/scores.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Scores])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
