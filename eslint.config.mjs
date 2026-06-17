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
];

export default eslintConfig;
