module.exports = {
  "parser": "@typescript-eslint/parser",
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "plugin:wc/recommended",
    "plugin:lit/recommended",
    "@open-wc",
    "prettier"
  ],
  "plugins": [
    "@typescript-eslint"
  ],
  "overrides": [
    {
      "env": {
        "node": true
      },
      "files": [
        ".eslintrc.{js,cjs}"
      ],
      "parserOptions": {
        "sourceType": "script"
      }
    }
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-unused-vars": "off",
    "class-methods-use-this": "off",
    "no-plusplus": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn"
    ],
    "no-param-reassign": [
      "warn"
    ],
    "import/no-duplicates": "off",
    "import/no-unresolved": "off",
    "import/extensions": [
      "error",
      "always",
      {
        "ignorePackages": true
      }
    ]
  }
}
