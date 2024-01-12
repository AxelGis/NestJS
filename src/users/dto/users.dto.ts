import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddScoresDto {
  @IsString()
  @ApiProperty({ default: 'user' })
  username: string;

  @IsNumber()
  @ApiProperty({ default: '100' })
  scores: number;
}
