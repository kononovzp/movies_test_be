import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PassportModule } from '@nestjs/passport';
import { AuthJwtTokenService } from 'auth/auth-jwt-token.service';
import { AuthController } from 'auth/auth.controller';
import { AuthService } from 'auth/auth.service';
import { AccessTokenGuard } from 'auth/guards/access-token.guard';
import { AuthGuard } from 'auth/guards/auth.guard';
import { UserModule } from 'user/user.module';

@Module({
  imports: [ConfigModule, PassportModule, forwardRef(() => UserModule)],
  controllers: [AuthController],
  providers: [AuthService, AuthJwtTokenService, AccessTokenGuard, AuthGuard],
  exports: [AuthService, AccessTokenGuard, AuthJwtTokenService, AuthGuard],
})
export class AuthModule {}
