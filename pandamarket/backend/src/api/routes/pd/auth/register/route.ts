// @ts-nocheck
// POST /api/pd/auth/register
// Creates a vendor account + store, returns a signed JWT

import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import {
  PdValidationError as PdBadRequestError,
  PdConflictError,
} from '../../../../utils/errors';
import { hashPassword, generatePdId } from '../../../../utils/crypto';

const schema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  store_name: z.string().min(1),
  subdomain: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, 'Le sous-domaine ne peut contenir que des lettres minuscules, chiffres et tirets'),
  category: z.string().optional(),
});

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    throw new PdBadRequestError('Données invalides', parsed.error.format());
  }

  const { first_name, last_name, email, password, store_name, subdomain, category } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const vendorService = req.scope.resolve('pdVendorService');
  const storeService = req.scope.resolve('pdStoreService');

  // Check for duplicate email
  const existing = await vendorService.findByEmail(normalizedEmail);
  if (existing) {
    throw new PdConflictError('PD_CONFLICT_EMAIL', 'Un compte avec cet email existe déjà');
  }

  // Check subdomain availability
  const subdomainAvailable = await storeService.isSubdomainAvailable(subdomain);
  if (!subdomainAvailable) {
    throw new PdConflictError('PD_CONFLICT_SUBDOMAIN', 'Ce sous-domaine est déjà utilisé');
  }

  // Create vendor credentials
  const passwordHash = await hashPassword(password);
  const vendorId = generatePdId('vendor');
  const vendor = await vendorService.createPdVendors([{
    id: vendorId,
    email: normalizedEmail,
    password_hash: passwordHash,
    first_name,
    last_name,
    role: 'vendor',
  }]);

  // Create associated store
  const storeId = generatePdId('store');
  const store = await storeService.createPdStores([{
    id: storeId,
    name: store_name,
    subdomain,
    category: category || null,
    owner_id: vendorId,
    status: 'unverified',
    subscription_plan: 'free',
  }]);

  const createdVendor = Array.isArray(vendor) ? vendor[0] : vendor;
  const createdStore = Array.isArray(store) ? store[0] : store;

  // Issue JWT
  const jwtSecret = process.env.PD_JWT_SECRET || process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT secret is not configured');
  }

  const accessToken = jwt.sign(
    {
      sub: createdVendor.id,
      store_id: createdStore.id,
      role: 'vendor',
    },
    jwtSecret,
    { expiresIn: process.env.PD_JWT_EXPIRY || '15m' },
  );

  res.status(201).json({
    access_token: accessToken,
    vendor: {
      id: createdVendor.id,
      email: createdVendor.email,
      first_name: createdVendor.first_name,
      last_name: createdVendor.last_name,
    },
    store: {
      id: createdStore.id,
      name: createdStore.name,
      subdomain: createdStore.subdomain,
      status: createdStore.status,
      subscription_plan: createdStore.subscription_plan,
    },
  });
};
