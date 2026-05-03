import { Queue } from 'bullmq';

const connection = {
  host: process.env.PD_REDIS_HOST || 'localhost',
  port: parseInt(process.env.PD_REDIS_PORT || '6379', 10),
};

export const imageCompressionQueue = new Queue('image-compression', { connection });
export const seoGenerationQueue = new Queue('seo-generation', { connection });
