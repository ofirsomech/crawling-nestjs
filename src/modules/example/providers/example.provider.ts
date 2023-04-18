import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ExampleResponseDto } from '../models/dto/example-response.dto';
import { ApiErrors } from '../enums/api-error.enum';
import { ExampleTransformer } from '../transformers/example.transformer';
import { ExampleService } from '../services/example.service';
import { AppLogger } from '../../../core/logger/logger';
import { ExampleRequestDto } from '../models/dto/example-request.dto';

@Injectable()
export class ExampleProvider {
  constructor(
    private readonly exampleService: ExampleService,
    private readonly appLogger: AppLogger
  ) {
    appLogger.setContext(`${this.constructor.name}`);
  }

  public async getExamples(): Promise<ExampleResponseDto[]> {
    try {
      this.appLogger.debug('Trying to get all example data');
      const examples = await this.exampleService.getExamples();
      return examples.map((example) =>
        ExampleTransformer.modelToResponseDto(example)
      );
    } catch (error) {
      this.appLogger.error(`Fail to get examples, ${error}`);
      throw new HttpException(
        ApiErrors.EXAMPLE_FAIL,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async createExample(
    exampleRequestDto: ExampleRequestDto
  ): Promise<ExampleResponseDto> {
    try {
      this.appLogger.debug('Trying to create example');
      const exampleToSave =
        ExampleTransformer.exampleRequestDtoToModel(exampleRequestDto);
      const example = await this.exampleService.createExample(exampleToSave);
      return ExampleTransformer.modelToResponseDto(example);
    } catch (error) {
      this.appLogger.error(`Fail to save examples, ${error}`);
      throw new HttpException(
        ApiErrors.EXAMPLE_FAIL,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
