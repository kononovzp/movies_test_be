import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export abstract class PageOptionsRequestQueryDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional()
  page: number = 1;

  @IsInt()
  @Min(0)
  @Max(150)
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional()
  take: number = 10;

  @Expose()
  get skip(): number {
    return (this.page - 1) * this.take;
  }

  set skip(value) {}
}
