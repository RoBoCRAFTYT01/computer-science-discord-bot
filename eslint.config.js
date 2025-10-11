import eslintPluginTs from '@typescript-eslint/eslint-plugin'
import parserTs from '@typescript-eslint/parser'

/** @type {import('eslint').Linter.Config} */
export default {
    files: ['**/*.ts'],
    languageOptions: {
        parser: parserTs,
        parserOptions: {
            sourceType: 'module',
            ecmaVersion: 'latest',
            project: './tsconfig.json',
        },
    },
    plugins: {
        '@typescript-eslint': eslintPluginTs,
    },
    rules: {
        ...eslintPluginTs.configs.recommended.rules,

        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'no-console': 'off',
        'no-undef': 'off',
    }
}
