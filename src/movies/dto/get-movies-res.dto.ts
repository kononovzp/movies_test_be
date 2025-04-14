import { IsNumber, IsString } from 'class-validator';
import { GetMovieResponseBodyDto } from 'movies/dto/get-movie-response-body.dto';

export class MoviesResponseDto {
  @IsString()
  movies: GetMovieResponseBodyDto[];

  @IsNumber()
  count: number;
}
