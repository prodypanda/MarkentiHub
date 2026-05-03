import { Worker, Job } from 'bullmq';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createServiceLogger } from '../utils/logger';

const logger = createServiceLogger('SeoGenerationWorker');

const connection = {
  host: process.env.PD_REDIS_HOST || 'localhost',
  port: parseInt(process.env.PD_REDIS_PORT || '6379', 10),
};

export const seoGenerationWorker = new Worker('seo-generation', async (job: Job) => {
  logger.info(`Processing SEO generation job ${job.id}`);
  const { title, description, storeId } = job.data;
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.PD_GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: process.env.PD_GEMINI_MODEL || 'gemini-1.5-pro' });
    
    const prompt = `Génère un titre SEO optimisé (max 70 caractères) et une méta-description (max 160 caractères) en français pour le produit suivant: Titre: ${title}, Description: ${description}. Format JSON: { "title": "...", "description": "...", "tags": ["...", "..."] }`;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    logger.info(`Successfully generated SEO content for store ${storeId}`);
    
    return { success: true, result: responseText };
  } catch (error) {
    logger.error({ err: error }, `Error processing SEO generation job ${job.id}`);
    throw error;
  }
}, { connection });
