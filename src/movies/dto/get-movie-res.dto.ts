import { IsString, IsUUID } from 'class-validator';

export class MovieResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  title: string;

  @IsString()
  publishYear: string;

  @IsString()
  photoUrl: string;
}
