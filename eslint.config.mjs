import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import _import from 'eslint-plugin-import';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        '**/dist',
        '**/node_modules',
        '**/*.config.js',
        '**/*.setup.js',
        '**/node_modules',
        '**/dist',
        '**/build',
        '**/coverage',
        '**/*.config.js',
        '**/*.setup.js',
        '**/.eslintrc.js',
    ],
}, ...fixupConfigRules(compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
)), {
    plugins: {
        '@typescript-eslint': fixupPluginRules(typescriptEslint),
        react: fixupPluginRules(react),
        'react-hooks': fixupPluginRules(reactHooks),
        import: fixupPluginRules(_import),
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: 'module',

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    settings: {
        react: {
            version: 'detect',
        },
    },

    rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',

        '@typescript-eslint/no-unused-vars': ['warn', {
            argsIgnorePattern: '^_',
        }],

        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'import/prefer-default-export': 'off',
        'import/no-unresolved': 'off',
        'no-console': 'warn',
        'no-debugger': 'warn',
        'no-unused-vars': 'off',

        quotes: ['error', 'single', {
            allowTemplateLiterals: true,
        }],

        semi: ['error', 'always'],
    },
}];