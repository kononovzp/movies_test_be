import { IsString } from 'class-validator';
import { MovieResponseDto } from 'movies/dto/get-movie-res.dto';

export class MoviesResponseDto {
  @IsString()
  movies: MovieResponseDto[];
}
