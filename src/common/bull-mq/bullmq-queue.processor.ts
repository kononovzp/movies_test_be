import { OnWorkerEvent, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

export abstract class BullMQQueueProcessor extends WorkerHost {
  private readonly bullMQQueueProcessorLogger = new Logger(
    BullMQQueueProcessor.name,
  );

  @OnWorkerEvent('active')
  //@ts-expect-error - this method is called under the hood
  private bullMQQueueProcessorOnActive(job: Job): void {
    this.bullMQQueueProcessorLogger.verbose(
      `${job.queueName}: Starting "${job.name}"[${job.id}] job, attempt #${job.attemptsMade}...`,
    );
  }

  @OnWorkerEvent('completed')
  //@ts-expect-error - this method is called under the hood
  private bullMQQueueProcessorOnCompleted(job: Job): void {
    this.bullMQQueueProcessorLogger.verbose(
      `${job.queueName}: Completed "${job.name}"[${job.id}] job, attempts made: ${job.attemptsMade}`,
    );
  }

  @OnWorkerEvent('failed')
  //@ts-expect-error - this method is called under the hood
  private bullMQQueueProcessorOnError(job: Job, error: Error): void {
    const { attemptsMade } = job;
    const message = `${job.queueName}: Failed ${job.name}[${job.id}] job, attempt #${
      attemptsMade
    }: ${error.message}${error.message ? ` - ${error.message}` : ''}`;

    if ((job.opts.attempts ?? 0) <= attemptsMade)
      this.bullMQQueueProcessorLogger.error(message);
    else this.bullMQQueueProcessorLogger.warn(message);
  }
}
