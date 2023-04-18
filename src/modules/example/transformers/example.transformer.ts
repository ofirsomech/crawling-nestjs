import { ExampleResponseDto } from '../models/dto/example-response.dto';
import { Example } from '../models/domain/example.entity';
import { ExampleRequestDto } from '../models/dto/example-request.dto';

export const ExampleTransformer = {
  modelToResponseDto(example: Example): ExampleResponseDto {
    return {
      example: example.example,
    };
  },
  exampleRequestDtoToModel(exampleRequestDto: ExampleRequestDto) {
    const example = new Example();
    example.example = exampleRequestDto.example;
    return example;
  },
};
