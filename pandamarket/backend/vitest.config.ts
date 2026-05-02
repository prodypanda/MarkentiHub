// pandamarket/backend/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/modules/**/service.ts', 'src/utils/**/*.ts'],
      thresholds: {
        lines: 80,
        branches: 75,
      },
    },
    testTimeout: 10000,
  },
});
