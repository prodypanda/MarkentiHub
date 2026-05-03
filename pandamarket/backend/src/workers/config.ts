import type { JobsOptions, QueueOptions, WorkerOptions } from 'bullmq';

export const QUEUE_NAMES = {
  imageCompression: 'image-compression',
  seoGeneration: 'seo-generation',
} as const;

function readIntegerEnv(
  name: string,
  defaultValue: number,
  min: number,
  max: number,
): number {
  const rawValue = process.env[name] ?? String(defaultValue);
  const value = Number(rawValue);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }
  return value;
}

function getWorkerConcurrency(): number {
  return readIntegerEnv('PD_WORKER_CONCURRENCY', 3, 1, 50);
}

function getWorkerRateLimitMax(): number {
  return readIntegerEnv('PD_WORKER_RATE_LIMIT_MAX', 30, 1, 10_000);
}

function getWorkerRateLimitDuration(): number {
  return readIntegerEnv('PD_WORKER_RATE_LIMIT_DURATION_MS', 60_000, 1_000, 3_600_000);
}

function getRedisConnectionName(): string {
  const name = process.env.PD_WORKER_CONNECTION_NAME ?? 'pandamarket-workers';
  if (!name.trim()) {
    throw new Error('PD_WORKER_CONNECTION_NAME must not be empty');
  }
  return name.trim();
}

function getRedisPassword(): string | undefined {
  const password = process.env.PD_REDIS_PASSWORD;
  return password || undefined;
}

function getRedisDatabase(): number {
  return readIntegerEnv('PD_REDIS_DB', 0, 0, 15);
}

function getRedisTls(): Record<string, never> | undefined {
  return process.env.PD_REDIS_TLS === 'true' ? {} : undefined;
}

function getRedisHost(): string {
  const host = process.env.PD_REDIS_HOST;
  if (!host && process.env.PD_NODE_ENV === 'production') {
    throw new Error('PD_REDIS_HOST must be set for BullMQ workers in production');
  }
  if (host && !host.trim()) {
    throw new Error('PD_REDIS_HOST must not be empty');
  }
  return host ?? 'localhost';
}

function getRedisPort(): number {
  return readIntegerEnv('PD_REDIS_PORT', 6379, 1, 65_535);
}

export function getRedisConnection(): NonNullable<QueueOptions['connection']> {
  const password = getRedisPassword();
  const tls = getRedisTls();
  const baseConnection = {
    host: getRedisHost(),
    port: getRedisPort(),
    db: getRedisDatabase(),
    connectionName: getRedisConnectionName(),
  };
  return {
    ...baseConnection,
    ...(password ? { password } : {}),
    ...(tls ? { tls } : {}),
  };
}

export const defaultJobOptions: JobsOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 5_000,
  },
  removeOnComplete: {
    age: 86_400,
    count: 1_000,
  },
  removeOnFail: {
    age: 604_800,
    count: 5_000,
  },
};

export function getQueueOptions(): QueueOptions {
  return {
    connection: getRedisConnection(),
    defaultJobOptions,
  };
}

export function getWorkerOptions(): WorkerOptions {
  return {
    connection: getRedisConnection(),
    concurrency: getWorkerConcurrency(),
    limiter: {
      max: getWorkerRateLimitMax(),
      duration: getWorkerRateLimitDuration(),
    },
  };
}
