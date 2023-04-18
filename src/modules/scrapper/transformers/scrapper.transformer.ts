import { ScrapperResponseDto } from '../models/dto/scrapper-response.dto';
import { Example } from '../models/domain/scrapper.entity';
import { ScrapperRequestDto } from '../models/dto/scrapper-request.dto';

export const ScrapperTransformer = {
  modelToResponseDto(example: Example): ScrapperResponseDto {
    return {
      example: example.example,
    };
  },
  exampleRequestDtoToModel(exampleRequestDto: ScrapperRequestDto) {
    const example = new Example();
    example.example = exampleRequestDto.example;
    return example;
  },
};
