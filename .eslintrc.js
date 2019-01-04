module.exports = {
    extends: 'eslint:recommended',
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single', { avoidEscape: true }],
        semi: ['error', 'never'],
        'no-console': 0,
        'comma-dangle': ['error', 'always-multiline'],
        'max-len': ['error', { code: 120 }],
    },
}
