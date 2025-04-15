import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthJwtTokenService } from 'auth/auth-jwt-token.service';
import { AuthController } from 'auth/auth.controller';
import { AuthService } from 'auth/auth.service';
import { AccessTokenGuard } from 'auth/guards/access-token.guard';
import { UserModule } from 'user/user.module';

@Module({
  imports: [ConfigModule, forwardRef(() => UserModule)],
  controllers: [AuthController],
  providers: [AuthService, AuthJwtTokenService, AccessTokenGuard],
  exports: [AuthService, AccessTokenGuard, AuthJwtTokenService],
})
export class AuthModule {}
