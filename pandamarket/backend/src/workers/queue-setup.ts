import { Queue } from 'bullmq';

import { getQueueOptions, QUEUE_NAMES } from './config';

export const imageCompressionQueue = new Queue(QUEUE_NAMES.imageCompression, getQueueOptions());
export const seoGenerationQueue = new Queue(QUEUE_NAMES.seoGeneration, getQueueOptions());
