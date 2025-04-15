import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMovieDto } from 'movies/dto/create-movie-request-body.dto';
import { GetMovieResponseBodyDto } from 'movies/dto/get-movie-response-body.dto';
import { Movies } from 'movies/entity/movies.entity';
import { MovieNotFoundByIdException } from 'movies/exceptions/movie-not-found-by-id.exception';
import { StorageService } from 'storage/storage.service';
import { Repository } from 'typeorm';
import { User } from 'user/entities/user.entity';
import { UserNotFoundByIdException } from 'user/exceptions/user-not-found-by-id.exception';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movies)
    private moviesRepository: Repository<Movies>,
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private readonly storageService: StorageService,
  ) {}

  async createMovie(
    createMovieDto: CreateMovieDto,
    poster: Express.Multer.File,
    userId: string,
  ): Promise<GetMovieResponseBodyDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const { buffer, originalname } = poster;
    const fileKey = await this.storageService.upload({
      file: buffer,
      filePath: `user/${userId}/${originalname}`,
      preserveFileName: true,
    });

    if (!user) throw new UserNotFoundByIdException(userId);

    const movie = this.moviesRepository.create({
      ...createMovieDto,
      filePath: fileKey,
      user,
    });

    await this.moviesRepository.save(movie);

    return {
      id: movie.id,
      title: movie.title,
      publishYear: movie.publishYear,
      photoUrl: this.storageService.getPublicUrl(movie.filePath),
    };
  }

  async getAllMovies({
    userId,
    skip = 0,
    take = 10,
  }: {
    userId: string;
    skip?: number;
    take?: number;
  }): Promise<{
    movies: GetMovieResponseBodyDto[];
    count: number;
  }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new UserNotFoundByIdException(userId);

    const [movies, count] = await this.moviesRepository.findAndCount({
      where: { user: { id: user.id } },
      skip,
      take,
    });

    return {
      movies: movies.map((movie) => ({
        id: movie.id,
        title: movie.title,
        publishYear: movie.publishYear,
        photoUrl: this.storageService.getPublicUrl(movie.filePath),
      })),
      count,
    };
  }

  async updateMovie(
    movieId: string,
    updateMovieDto: CreateMovieDto,
    poster: Express.Multer.File | undefined,
    userId: string,
  ): Promise<GetMovieResponseBodyDto> {
    const movie = await this.moviesRepository.findOne({
      where: { id: movieId, user: { id: userId } },
      relations: ['user'],
    });

    if (!movie) throw new MovieNotFoundByIdException(movieId);

    if (updateMovieDto.title) movie.title = updateMovieDto.title;
    if (updateMovieDto.publishYear)
      movie.publishYear = updateMovieDto.publishYear;

    if (poster) {
      const fileKey = await this.storageService.upload({
        file: poster.buffer,
        filePath: `user/${userId}/${poster.originalname}`,
        preserveFileName: true,
      });
      movie.filePath = fileKey;
    }

    await this.moviesRepository.save(movie);

    return {
      id: movie.id,
      title: movie.title,
      publishYear: movie.publishYear,
      photoUrl: this.storageService.getPublicUrl(movie.filePath),
    };
  }
}
