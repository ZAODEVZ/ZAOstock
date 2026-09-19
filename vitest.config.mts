import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    // e2e/ is Playwright's suite (playwright.config.ts, `npm run test:e2e`),
    // a different test runner with its own `test`/`expect` - vitest picking
    // it up fails every spec with "page is not defined".
    exclude: ['**/node_modules/**', 'e2e/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
