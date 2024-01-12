import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '../auth/dto/auth.dto';
import { UsersService } from '../users/users.service';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Register new user
   * @param registerDto
   * @returns
   */
  async register(registerDto: RegisterDto) {
    const { username, email, password, role = 'user' } = registerDto;

    //create new user
    const newUser: User = await this.usersService.create(
      username,
      email,
      password,
      role,
    );

    return newUser;
  }

  /**
   * Login user
   * @param email
   * @param password
   * @returns
   */
  async login(email: string, password: string) {
    const user = await this.usersService.findOne(email);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { userId: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      ...user,
      password: undefined,
    };
  }
}
