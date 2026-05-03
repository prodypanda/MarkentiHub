import { Worker, Job } from 'bullmq';
import sharp from 'sharp';
import { createServiceLogger } from '../utils/logger';

const logger = createServiceLogger('ImageCompressionWorker');

const connection = {
  host: process.env.PD_REDIS_HOST || 'localhost',
  port: parseInt(process.env.PD_REDIS_PORT || '6379', 10),
};

export const imageCompressionWorker = new Worker('image-compression', async (job: Job) => {
  logger.info(`Processing image compression job ${job.id}`);
  const { fileBuffer, storeId } = job.data;
  
  try {
    const buffer = Buffer.from(fileBuffer, 'base64');
    
    // Compress the image
    const compressedBuffer = await sharp(buffer)
      .webp({ quality: 80 })
      .toBuffer();
      
    logger.info(`Successfully compressed image for store ${storeId}. Original: ${buffer.length}, New: ${compressedBuffer.length}`);
    
    return { success: true, newSize: compressedBuffer.length };
  } catch (error) {
    logger.error({ err: error }, `Error processing image compression job ${job.id}`);
    throw error;
  }
}, { connection });
