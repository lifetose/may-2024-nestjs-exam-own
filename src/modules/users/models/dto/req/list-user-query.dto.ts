import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { TransformHelper } from '../../../../../common/helpers/transform.helper';

export class ListUserQueryDto {
  @Type(() => Number)
  @IsInt()
  @Max(100)
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  page?: number = 1;

  @Type(() => String)
  @IsString()
  @IsOptional()
  name?: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  email?: string;

  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  @IsString()
  @IsOptional()
  search?: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  sort?: 'ASC' | 'DESC';
}
