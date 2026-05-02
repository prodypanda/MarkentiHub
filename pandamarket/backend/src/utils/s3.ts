// pandamarket/backend/src/utils/s3.ts
// =============================================================================
// PandaMarket — S3-Compatible Storage Utilities
// Works with MinIO (dev) and Cloudflare R2 / AWS S3 (production)
// =============================================================================

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { FILE_CONSTRAINTS, S3_BUCKETS } from './constants';

let s3Client: S3Client | null = null;

/**
 * Get or create the singleton S3 client instance.
 * Configuration is loaded from PD_S3_* environment variables.
 */
export function getS3Client(): S3Client {
  if (s3Client) {
    return s3Client;
  }

  s3Client = new S3Client({
    endpoint: process.env.PD_S3_ENDPOINT,
    region: process.env.PD_S3_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.PD_S3_ACCESS_KEY || '',
      secretAccessKey: process.env.PD_S3_SECRET_KEY || '',
    },
    forcePathStyle: true, // Required for MinIO compatibility
  });

  return s3Client;
}

/**
 * Generate a presigned PUT URL for direct client-to-S3 upload.
 *
 * The frontend uses this URL to upload files directly to S3/MinIO,
 * bypassing the backend server entirely (security + performance).
 */
export async function generatePresignedUploadUrl(params: {
  bucket: string;
  key: string;
  contentType: string;
  expiresIn?: number;
}): Promise<string> {
  const client = getS3Client();

  const command = new PutObjectCommand({
    Bucket: params.bucket,
    Key: params.key,
    ContentType: params.contentType,
  });

  return getSignedUrl(client, command, {
    expiresIn: params.expiresIn || FILE_CONSTRAINTS.PRESIGNED_URL_EXPIRY_UPLOAD,
  });
}

/**
 * Generate a presigned GET URL for secure file download.
 *
 * Used for: KYC documents, mandat proofs, digital products
 */
export async function generatePresignedDownloadUrl(params: {
  bucket: string;
  key: string;
  expiresIn?: number;
}): Promise<string> {
  const client = getS3Client();

  const command = new GetObjectCommand({
    Bucket: params.bucket,
    Key: params.key,
  });

  return getSignedUrl(client, command, {
    expiresIn:
      params.expiresIn || FILE_CONSTRAINTS.PRESIGNED_URL_EXPIRY_DOWNLOAD,
  });
}

/**
 * Delete an object from S3.
 */
export async function deleteS3Object(params: {
  bucket: string;
  key: string;
}): Promise<void> {
  const client = getS3Client();

  const command = new DeleteObjectCommand({
    Bucket: params.bucket,
    Key: params.key,
  });

  await client.send(command);
}

/**
 * Generate the S3 key for a product image.
 * Format: stores/{storeId}/products/{productId}/{filename}
 */
export function getProductImageKey(
  storeId: string,
  productId: string,
  filename: string,
): string {
  return `stores/${storeId}/products/${productId}/${filename}`;
}

/**
 * Generate the S3 key for a KYC document.
 * Format: kyc/{storeId}/{documentType}_{timestamp}.{ext}
 */
export function getKycDocumentKey(
  storeId: string,
  documentType: 'rc' | 'cin',
  extension: string,
): string {
  const timestamp = Date.now();
  return `kyc/${storeId}/${documentType}_${timestamp}.${extension}`;
}

/**
 * Generate the S3 key for a Mandat Minute proof.
 * Format: mandats/{orderId}/{timestamp}.{ext}
 */
export function getMandatProofKey(
  orderId: string,
  extension: string,
): string {
  const timestamp = Date.now();
  return `mandats/${orderId}/${timestamp}.${extension}`;
}

/**
 * Generate the S3 key for a digital product file.
 * Format: digital/{storeId}/{productId}/{filename}
 */
export function getDigitalProductKey(
  storeId: string,
  productId: string,
  filename: string,
): string {
  return `digital/${storeId}/${productId}/${filename}`;
}

/**
 * Get the public URL for a product image (no presigning needed).
 * Only works for the public bucket.
 */
export function getPublicImageUrl(key: string): string {
  const endpoint = process.env.PD_S3_ENDPOINT || 'http://localhost:9000';
  return `${endpoint}/${S3_BUCKETS.PUBLIC_IMAGES}/${key}`;
}

/**
 * Generate presigned upload URL for a product image with validation.
 */
export async function getProductImageUploadUrl(
  storeId: string,
  productId: string,
  filename: string,
  contentType: string,
): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
  const key = getProductImageKey(storeId, productId, filename);

  const uploadUrl = await generatePresignedUploadUrl({
    bucket: S3_BUCKETS.PUBLIC_IMAGES,
    key,
    contentType,
  });

  const publicUrl = getPublicImageUrl(key);

  return { uploadUrl, publicUrl, key };
}

/**
 * Generate presigned upload URL for a KYC document.
 */
export async function getKycUploadUrl(
  storeId: string,
  documentType: 'rc' | 'cin',
  contentType: string,
): Promise<{ uploadUrl: string; key: string }> {
  const extension = contentType.split('/')[1] || 'jpg';
  const key = getKycDocumentKey(storeId, documentType, extension);

  const uploadUrl = await generatePresignedUploadUrl({
    bucket: S3_BUCKETS.PRIVATE_FILES,
    key,
    contentType,
  });

  return { uploadUrl, key };
}

/**
 * Generate presigned upload URL for a Mandat proof.
 */
export async function getMandatUploadUrl(
  orderId: string,
  contentType: string,
): Promise<{ uploadUrl: string; key: string }> {
  const extension = contentType.split('/')[1] || 'jpg';
  const key = getMandatProofKey(orderId, extension);

  const uploadUrl = await generatePresignedUploadUrl({
    bucket: S3_BUCKETS.PRIVATE_FILES,
    key,
    contentType,
  });

  return { uploadUrl, key };
}
