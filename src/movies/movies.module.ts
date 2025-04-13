import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'auth/auth.module';
import { Movies } from 'movies/entity/movies.entity';
import { MoviesController } from 'movies/movies.controller';
import { MoviesService } from 'movies/movies.service';
import { User } from 'user/entities/user.entity';
import { UserModule } from 'user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Movies, User]), AuthModule, UserModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
