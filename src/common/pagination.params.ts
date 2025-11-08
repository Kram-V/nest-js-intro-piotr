import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class PaginationParams {
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  offset?: number = 0;
}
