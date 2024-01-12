import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { UsersService } from '../users/users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { AddScoresDto } from '../users/dto/users.dto';
import { SkipThrottle } from '@nestjs/throttler';

@Controller()
@ApiTags('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/profile')
  @ApiBearerAuth('JWT-auth')
  findMe(
    @Request()
    req: ExpressRequest & { user: { userId: number; email: string } },
  ) {
    return this.usersService.findById(req.user.userId);
  }

  @Post('/scores')
  @ApiBearerAuth('JWT-auth')
  @SkipThrottle({ default: false })
  addScores(
    @Body() { username, scores }: AddScoresDto,
    @Request()
    req: ExpressRequest & { user: { userId: number; email: string } },
  ) {
    return this.usersService.addScores(req.user.userId, username, scores);
  }

  @Public()
  @Get('/leaderboard')
  leaderboard() {
    return this.usersService.leaderboard();
  }
}
