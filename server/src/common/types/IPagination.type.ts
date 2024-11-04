import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels()
export class Pagination<T> {
  @ApiProperty()
  docs: T[];

  @ApiProperty()
  totalDocs: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  totalPages: number;
}
