// @ts-nocheck
// POST /api/pd/auth/login
// Authenticates a vendor and returns a signed JWT

import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import {
  PdValidationError as PdBadRequestError,
  PdAuthenticationError,
} from '../../../../utils/errors';
import { verifyPassword } from '../../../../utils/crypto';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    throw new PdBadRequestError('Données invalides', parsed.error.format());
  }

  const { email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const vendorService = req.scope.resolve('pdVendorService');
  const storeService = req.scope.resolve('pdStoreService');

  // Lookup vendor — use a generic error to avoid user enumeration
  const vendor = await vendorService.findByEmail(normalizedEmail);
  if (!vendor || !vendor.is_active) {
    throw new PdAuthenticationError('PD_AUTH_INVALID_CREDENTIALS', 'Email ou mot de passe incorrect');
  }

  // Verify password
  const passwordValid = await verifyPassword(password, vendor.password_hash);
  if (!passwordValid) {
    throw new PdAuthenticationError('PD_AUTH_INVALID_CREDENTIALS', 'Email ou mot de passe incorrect');
  }

  // Lookup vendor's store
  const [store] = await storeService.listPdStores({
    filters: { owner_id: vendor.id },
  });

  if (!store) {
    throw new PdAuthenticationError('PD_AUTH_NO_STORE', 'Aucune boutique associée à ce compte');
  }

  // Issue JWT
  const jwtSecret = process.env.PD_JWT_SECRET || process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('[auth/login] PD_JWT_SECRET environment variable is not set');
    throw new Error('JWT secret is not configured. Please set the PD_JWT_SECRET environment variable.');
  }

  const accessToken = jwt.sign(
    {
      sub: vendor.id,
      store_id: store.id,
      role: vendor.role,
    },
    jwtSecret,
    { expiresIn: process.env.PD_JWT_EXPIRY || '15m' },
  );

  res.json({
    access_token: accessToken,
    vendor: {
      id: vendor.id,
      email: vendor.email,
      first_name: vendor.first_name,
      last_name: vendor.last_name,
      role: vendor.role,
    },
    store: {
      id: store.id,
      name: store.name,
      subdomain: store.subdomain,
      status: store.status,
      subscription_plan: store.subscription_plan,
    },
  });
};
