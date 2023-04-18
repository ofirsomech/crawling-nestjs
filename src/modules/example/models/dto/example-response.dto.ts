import { ApiProperty } from '@nestjs/swagger';

export class ExampleResponseDto {
  @ApiProperty()
  example: string;
}
