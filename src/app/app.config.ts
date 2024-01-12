import {
  IsDefined,
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class AppConfig {
  @IsNumber()
  @IsPositive()
  @IsInt()
  @IsDefined()
  public readonly APP_PORT!: number;

  @IsString()
  @IsDefined()
  public readonly POSTGRESQL_DB_URL!: string;

  @IsDefined()
  @IsString()
  public readonly JWT_SECRET!: string;

  @IsDefined()
  @IsString()
  public readonly JWT_LIFETIME!: string;

  @IsDefined()
  @IsNumber()
  public readonly THROTTLER_TTL!: number;

  @IsDefined()
  @IsNumber()
  public readonly THROTTLER_LIMIT!: number;
}
