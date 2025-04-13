import { Expose } from 'class-transformer';

export class SuccessAuthResponseDto {
  constructor(data: SuccessAuthResponseDto) {
    Object.assign(this, data);
  }

  @Expose() accessToken: string;

  @Expose() refreshToken?: string;
}
