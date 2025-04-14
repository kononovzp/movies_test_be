import { Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

export class GetMovieResponseBodyDto {
  constructor(data: GetMovieResponseBodyDto) {
    Object.assign(this, data);
  }

  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsString()
  title: string;

  @Expose()
  @IsString()
  publishYear: string;

  @Expose()
  @IsString()
  photoUrl: string;
}
