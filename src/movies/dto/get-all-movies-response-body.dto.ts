import { Expose } from 'class-transformer';
import { PageOptionsResponseBodyDto } from 'common/dtos/page-options-response-body.dto';
import { GetMovieResponseBodyDto } from 'movies/dto/get-movie-response-body.dto';
import { Diff, Overwrite } from 'utility-types';

export class GetAllMoviesResponseBody extends PageOptionsResponseBodyDto {
  constructor(
    data: Overwrite<
      Diff<GetAllMoviesResponseBody, PageOptionsResponseBodyDto>,
      { movies: GetMovieResponseBodyDto[] }
    > &
      ConstructorParameters<typeof PageOptionsResponseBodyDto>[0],
  ) {
    super(data);
    this.movies = data.movies.map(
      (movies) => new GetMovieResponseBodyDto(movies),
    );
  }

  @Expose() movies: GetMovieResponseBodyDto[];
}
