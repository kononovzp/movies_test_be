import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { UserJwtPayload } from 'auth/decorators/user-jwt-payload.decorator';
import { UserJwtPayloadDto } from 'auth/dto/user-jwt-payload.dto';
import { AccessTokenGuard } from 'auth/guards/access-token.guard';
import { PageOptionsRequestQueryDto } from 'common/dtos/page-options-request-query.dto';
import { CreateMovieDto } from 'movies/dto/create-movie-request-body.dto';
import { GetAllMoviesResponseBody } from 'movies/dto/get-all-movies-response-body.dto';
import { GetMovieResponseBodyDto } from 'movies/dto/get-movie-response-body.dto';
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
  ): Promise<GetMovieResponseBodyDto> {
    const { userId } = userJwtPayload;

    return this.moviesService.createMovie(createMovieDto, poster, userId);
  }

  @Get()
  async getMovies(
    @UserJwtPayload() userJwtPayload: UserJwtPayloadDto,
    @Query() query: PageOptionsRequestQueryDto,
  ): Promise<GetAllMoviesResponseBody> {
    const { userId } = userJwtPayload;
    const { page, take } = query;

    const { movies, count } = await this.moviesService.getAllMovies({
      ...query,
      userId,
    });
    return new GetAllMoviesResponseBody({
      metadata: { itemsAmount: count, page, take },
      movies,
    });
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('poster'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update a movie by ID' })
  async updateMovie(
    @Param('id') movieId: string,
    @Body() updateMovieDto: CreateMovieDto,
    @UserJwtPayload() userJwtPayload: UserJwtPayloadDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: '(image/png|image/jpeg)' }),
        ],
      }),
    )
    poster?: Express.Multer.File,
  ): Promise<GetMovieResponseBodyDto> {
    return this.moviesService.updateMovie(
      movieId,
      updateMovieDto,
      poster,
      userJwtPayload.userId,
    );
  }
}
