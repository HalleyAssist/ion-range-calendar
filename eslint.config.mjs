// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

export default tseslint.config(
  {
    files: ['**/*.ts'],
    ignores: [
      '**/*.worker.ts',
      'src/mocks/**/*.ts',
      '**/*.prod.ts',
    ],
    languageOptions: {
      parserOptions: {
        project: ["tsconfig.(app|spec).json"],
      },
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/component-class-suffix': [
        'off',
        {
          suffixes: ['Component', 'Page'],
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: ['element', 'attribute'],
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'ha',
          style: 'camelCase'
        }
      ],
      curly: 'off',
      semi: 'error',
      'no-constant-condition': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        }
      ],
      quotes: [
        'warn',
        'single'
      ],
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@ionic/angular',
              message: 'Please import Ionic standalone components instead: `import { IonButton } from \'@ionic/angular/standalone\'`.',
              allowTypeImports: true
            }
          ]
        }
      ],
      'no-console': [
        'error',
        {
          allow: ['info', 'warn', 'error']
        }
      ],
      'no-debugger': 'error',
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },
);
