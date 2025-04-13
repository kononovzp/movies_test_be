// @ts-check

import eslint from '@eslint/js';
import noRelativePathImportPlugin from 'eslint-plugin-no-relative-import-paths';
import prettierPlugin from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: { allowDefaultProject: ['*.mjs'] },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      prettierPlugin,
      noRelativePathImportPlugin,
    },
    rules: {
      'prettierPlugin/prettier': 'warn',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      'noRelativePathImportPlugin/no-relative-import-paths': 'error',
    },
  },
);
