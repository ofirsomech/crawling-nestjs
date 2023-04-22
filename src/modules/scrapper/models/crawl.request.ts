import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScrapperRequestDto {
  @IsOptional()
  @ApiProperty({ example: 'https://www.one.co.il' })
  url: string;
}
