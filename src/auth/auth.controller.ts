import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'auth/auth.service';
import { CreateUserDto } from 'auth/dto/create-user.dto';
import { LoginDto } from 'auth/dto/login.dto';
import { SuccessAuthResponseDto } from 'auth/dto/success-auth-response.dto';
import { IncorrectEmailOrPasswordException } from 'auth/exceptions/incorrect-email-or-password.exception';
import { userCreationFailedExceptionSample } from 'auth/exceptions/user-creation-failed.exception';
import { ApiNamedException } from 'common/decorators/named-api-exception.decorator';
import { userAlreadyExistsExceptionSample } from 'user/exceptions/user-already-exists.exception';

@ApiTags('authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @ApiNamedException(() => [
    userAlreadyExistsExceptionSample,
    userCreationFailedExceptionSample,
  ])
  @ApiOperation({
    summary: 'Sign up user and obtain access and refresh tokens',
  })
  async signUp(@Body() body: CreateUserDto): Promise<SuccessAuthResponseDto> {
    const { remember } = body;
    console.log('body: ', body);

    const response = await this.authService.signUp(body, remember);

    return new SuccessAuthResponseDto(response);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiNamedException(() => [IncorrectEmailOrPasswordException])
  @ApiOperation({
    summary: 'Sign in user and obtain access and refresh tokens',
  })
  async signIn(@Body() body: LoginDto): Promise<SuccessAuthResponseDto> {
    const { remember } = body;
    const response = await this.authService.signIn(body, remember);

    return new SuccessAuthResponseDto(response);
  }
}
