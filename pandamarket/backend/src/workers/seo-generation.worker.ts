import { Worker, Job } from 'bullmq';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { createServiceLogger } from '../utils/logger';
import { getWorkerOptions, QUEUE_NAMES } from './config';

const logger = createServiceLogger('SeoGenerationWorker');

const seoGenerationJobSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5_000).optional().default(''),
  storeId: z.string().trim().min(1).max(128),
});

type SeoGenerationJobData = z.infer<typeof seoGenerationJobSchema>;

function getGeminiApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.PD_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY must be set for SEO generation worker');
  }
  return apiKey;
}

export const seoGenerationWorker = new Worker<SeoGenerationJobData>(
  QUEUE_NAMES.seoGeneration,
  async (job: Job<SeoGenerationJobData>) => {
    logger.info({ job_id: job.id, attempt: job.attemptsMade + 1 }, 'Processing SEO generation job');
    const parsed = seoGenerationJobSchema.safeParse(job.data);
    if (!parsed.success) {
      logger.error({ job_id: job.id, issues: parsed.error.issues }, 'Invalid SEO generation job payload');
      throw new Error('Invalid SEO generation job payload');
    }
    const { title, description, storeId } = parsed.data;

    try {
      const genAI = new GoogleGenerativeAI(getGeminiApiKey());
      const model = genAI.getGenerativeModel({ model: process.env.PD_GEMINI_MODEL || 'gemini-1.5-pro' });
      const prompt = `Génère un titre SEO optimisé (max 70 caractères) et une méta-description (max 160 caractères) en français pour le produit suivant: Titre: ${title}, Description: ${description}. Format JSON: { "title": "...", "description": "...", "tags": ["...", "..."] }`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      logger.info({ job_id: job.id, store_id: storeId }, 'Successfully generated SEO content');

      return { success: true, result: responseText };
    } catch (error) {
      logger.error(
        { err: error, job_id: job.id, store_id: storeId },
        'Error processing SEO generation job',
      );
      throw error;
    }
  },
  getWorkerOptions(),
);
