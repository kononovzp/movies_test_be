import type { NestMiddleware } from '@nestjs/common';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { deepmerge } from 'deepmerge-ts';
import type { RedisClientType } from 'redis';
import type { Server, ServerOptions } from 'socket.io';

export class RedisIoAdapter extends IoAdapter {
  constructor(
    app: NestExpressApplication,
    private readonly middlewares?: NestMiddleware[],
    private readonly corsSettings?: CorsOptions,
  ) {
    super(app);
  }

  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(redisClient: RedisClientType): Promise<void> {
    const pubClient = redisClient.duplicate();
    const subClient = redisClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(
      port,
      deepmerge({ corsOptions: this.corsSettings }, options),
    ) as Server;

    server.adapter(this.adapterConstructor);

    this.middlewares?.forEach((m) => server.engine.use(m.use.bind(m)));

    return server;
  }
}
