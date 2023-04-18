import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiErrors } from '../../../enums/api-error.enum';
import { ExampleProvider } from '../../../providers/example.provider';
import { ExampleRequestDto } from '../../../models/dto/example-request.dto';
import { ExampleResponseDto } from '../../../models/dto/example-response.dto';
import { AuthenticationGuard } from '../../../../../guards/authentication/authentication.guard';
import { AppLogger } from '../../../../../core/logger/logger';

@ApiTags('Example')
@Controller({ path: 'example', version: '1' })
export class ExampleV1Controller {
  constructor(
    private readonly exampleProvider: ExampleProvider,
    private readonly appLogger: AppLogger
  ) {
    appLogger.setContext(`${this.constructor.name}`);
  }

  @Post()
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Example' })
  @ApiCreatedResponse({
    description: 'Example success',
    type: ExampleResponseDto,
  })
  @ApiInternalServerErrorResponse({ description: ApiErrors.EXAMPLE_FAIL })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async createExample(
    @Body() createExampleRequestDto: ExampleRequestDto
  ): Promise<ExampleResponseDto> {
    return this.exampleProvider.createExample(createExampleRequestDto);
  }

  @Get()
  @ApiOperation({ description: 'Example' })
  @ApiOkResponse({
    description: 'Example success',
    type: [ExampleResponseDto],
  })
  @ApiInternalServerErrorResponse({ description: ApiErrors.EXAMPLE_FAIL })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getExamples(): Promise<ExampleResponseDto[]> {
    return this.exampleProvider.getExamples();
  }
}
