import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

// Next 16 dropped `next lint`; eslint-config-next now ships native flat configs.
const eslintConfig = [
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts', 'scripts/**'] },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // React 19's new rule flags idiomatic SSR mount-guards and one-time
      // initialization (e.g. setMounted(true), localStorage reads). These are
      // not bugs, so keep the signal as a warning rather than a hard error.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  {
    // ops-room/*.js are plain Node CommonJS scripts - a build step and a static
    // server - not application code and not TypeScript. no-require-imports is a
    // TypeScript rule and require() is simply how these files work, so it fired
    // on correct code and turned the whole repo's CI red on 2026-08-31.
    //
    // Scoped to the rule rather than ignoring the directory, so these files keep
    // every other lint check. `scripts/**` is fully ignored above; this is the
    // narrower version of the same idea.
    files: ['ops-room/**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];

export default eslintConfig;
