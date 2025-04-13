import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { UserJwtPayload } from 'auth/decorators/user-jwt-payload.decorator';
import { UserJwtPayloadDto } from 'auth/dto/user-jwt-payload.dto';
import { AccessTokenGuard } from 'auth/guards/access-token.guard';
import { CreateMovieDto } from 'movies/dto/create-movie.dto';
import { MovieResponseDto } from 'movies/dto/get-movie-res.dto';
import { MoviesResponseDto } from 'movies/dto/get-movies-res.dto';
import { MoviesService } from 'movies/movies.service';

@UseGuards(AccessTokenGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('poster'))
  @ApiOperation({ summary: 'Update current user data' })
  @ApiConsumes('multipart/form-data')
  async createMovie(
    @Body() createMovieDto: CreateMovieDto,
    @UserJwtPayload() userJwtPayload: UserJwtPayloadDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: '(image/png|image/jpeg)' }),
        ],
      }),
    )
    poster: Express.Multer.File,
  ): Promise<MovieResponseDto> {
    const { userId } = userJwtPayload;

    return this.moviesService.createMovie(createMovieDto, poster, userId);
  }

  @Get()
  async getMovies(
    @UserJwtPayload() userJwtPayload: UserJwtPayloadDto,
  ): Promise<MoviesResponseDto> {
    const { userId } = userJwtPayload;
    console.log('userId: ', userId);

    return this.moviesService.getAllMovies(userId);
  }
}
