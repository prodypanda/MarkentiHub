import { Worker, Job } from 'bullmq';
import sharp from 'sharp';
import { z } from 'zod';
import { createServiceLogger } from '../utils/logger';
import { getWorkerOptions, QUEUE_NAMES } from './config';

const logger = createServiceLogger('ImageCompressionWorker');

const imageCompressionJobSchema = z.object({
  fileBuffer: z.string().min(1),
  storeId: z.string().trim().min(1).max(128),
});

type ImageCompressionJobData = z.infer<typeof imageCompressionJobSchema>;

export const imageCompressionWorker = new Worker<ImageCompressionJobData>(
  QUEUE_NAMES.imageCompression,
  async (job: Job<ImageCompressionJobData>) => {
    logger.info({ job_id: job.id, attempt: job.attemptsMade + 1 }, 'Processing image compression job');
    const parsed = imageCompressionJobSchema.safeParse(job.data);
    if (!parsed.success) {
      logger.error({ job_id: job.id, issues: parsed.error.issues }, 'Invalid image compression job payload');
      throw new Error('Invalid image compression job payload');
    }
    const { fileBuffer, storeId } = parsed.data;

    try {
      const buffer = Buffer.from(fileBuffer, 'base64');
      // Compress the image
      const compressedBuffer = await sharp(buffer)
        .webp({ quality: 80 })
        .toBuffer();

      logger.info(
        {
          job_id: job.id,
          store_id: storeId,
          original_size: buffer.length,
          compressed_size: compressedBuffer.length,
        },
        'Successfully compressed image',
      );

      return { success: true, newSize: compressedBuffer.length };
    } catch (error) {
      logger.error(
        { err: error, job_id: job.id, store_id: storeId },
        'Error processing image compression job',
      );
      throw error;
    }
  },
  getWorkerOptions(),
);
