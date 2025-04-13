import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'environment/environment.type';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  private readonly logger = new Logger(AppService.name);

  private readonly isProduction = this.configService.get('isProduction', {
    infer: true,
  });

  private runSeeders(): void {
    if (!this.isProduction) {
      this.logger.log('Running seeders...');
    }
  }

  onApplicationBootstrap(): void {
    this.runSeeders();
  }
}
