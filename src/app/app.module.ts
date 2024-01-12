import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { checkNodeEnv, useConfigs } from '../etc';
import * as path from 'node:path';
import { AppConfig } from '../app/app.config';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { User } from '../entities/user.entity';
import { Scores } from '../entities/scores.entity';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';

const { isTesting, isDev } = checkNodeEnv();

const envFilePaths: string[] = [];

if (isTesting) {
  envFilePaths.push(path.resolve(process.cwd(), '.env.e2e'));
} else if (isDev) {
  envFilePaths.push(path.resolve(process.cwd(), '.env.dev'));
}

@Module({
  imports: [
    ...useConfigs([AppConfig], envFilePaths),
    TypeOrmModule.forRootAsync({
      useFactory: async (appConfig: AppConfig) => ({
        type: 'postgres',
        url: appConfig.POSTGRESQL_DB_URL,
        entities: [User, Scores],
        synchronize: true,
      }),
      inject: [AppConfig],
    }),
    ThrottlerModule.forRootAsync({
      useFactory: async (
        appConfig: AppConfig,
      ): Promise<ThrottlerModuleOptions> => [
        {
          ttl: appConfig.THROTTLER_TTL,
          limit: appConfig.THROTTLER_LIMIT,
        },
      ],
      inject: [AppConfig],
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
