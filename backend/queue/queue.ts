import { Queue } from 'bullmq';
import type { ConnectionOptions } from 'bullmq';

export const redisConnection: ConnectionOptions = {
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  port: Number(process.env.REDIS_PORT ?? 6379),
};

export const emailQueue = new Queue('emailQueue', {
  connection: redisConnection
});




