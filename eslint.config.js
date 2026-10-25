import tseslint from 'typescript-eslint';
export default tseslint.config(...tseslint.configs.recommended, {
  rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }] }
}, {
  files: ['desktop/preload.cjs'],
  rules: { '@typescript-eslint/no-require-imports': 'off' }
});
