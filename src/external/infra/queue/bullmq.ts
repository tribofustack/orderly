import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { env } from 'src/internal/application/configs/env';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'payments',
        defaultJobOptions: { attempts: 2 },
      },
      {
        name: 'orders',
        defaultJobOptions: { attempts: 2 },
      },
    ),
    BullModule.forRoot({
      redis: {
        host: env.cacheHost,
        port: env.cachePort,
      },
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
