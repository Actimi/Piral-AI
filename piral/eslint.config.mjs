export default [
    {
        files: ["**/*.js", "**/*.mjs"],
        rules: {
            "no-console": "off",
            "no-debugger": "off",
            "no-unused-vars": "warn",
            semi: ["warn", "always"],
            quotes: ["warn", "single"],
            indent: ["warn", 2],
            "comma-dangle": ["warn", "never"],
            "no-trailing-spaces": "warn",
            "eol-last": ["warn", "always"],
        },
    },
]
