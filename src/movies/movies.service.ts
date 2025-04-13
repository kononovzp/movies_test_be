import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMovieDto } from 'movies/dto/create-movie.dto';
import { MovieResponseDto } from 'movies/dto/get-movie-res.dto';
import { MoviesResponseDto } from 'movies/dto/get-movies-res.dto';
import { Movies } from 'movies/entity/movies.entity';
import { StorageService } from 'storage/storage.service';
import { Repository } from 'typeorm';
import { User } from 'user/entities/user.entity';

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
  ): Promise<MovieResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const { buffer, originalname } = poster;
    const fileKey = await this.storageService.upload({
      file: buffer,
      filePath: `user/${userId}/${originalname}`,
      preserveFileName: true,
    });

    if (!user) {
      throw new Error('User not found');
    }

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

  async getAllMovies(userId: string): Promise<MoviesResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }
    console.log('user: ', user);

    const movies = await this.moviesRepository.find({
      where: { user: { id: user.id } },
    });

    return {
      movies: movies.map((movie) => ({
        id: movie.id,
        title: movie.title,
        publishYear: movie.publishYear,
        photoUrl: this.storageService.getPublicUrl(movie.filePath),
      })),
    };
  }
}
