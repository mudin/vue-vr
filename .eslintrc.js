module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/airbnb'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  globals: {
    window: true,
    THREE: true
  },
  plugins: ['prettier'],
  rules: {
    'vue/experimental-script-setup-vars': 'off',
    'operator-linebreak': 'off',
    'arrow-parens': 'off',
    'comma-dangle': [
      'error',
      {
        arrays: 'never',
        objects: 'never',
        imports: 'never',
        exports: 'never',
        functions: 'ignore'
      }
    ],
    'prefer-destructuring': [
      'error',
      {
        array: true,
        object: false
      },
      {
        enforceForRenamedProperties: false
      }
    ],
    'arrow-parens': 'off',
    'function-paren-newline': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    // 'import/no-extraneous-dependencies': context => [
    //   'error',
    //   {
    //     devDependencies: true,
    //     packageDir: [context.getFilename(), __dirname]
    //   }
    // ],
    'vue/no-unused-components': [
      'error',
      {
        ignoreWhenBindingPresent: true
      }
    ],
    'vue/no-use-v-if-with-v-for': 'off',
    'no-console': 'off',
    'vue/no-parsing-error': [
      2,
      {
        'x-invalid-end-tag': false,
        'control-character-in-input-stream': false
      }
    ],
    'vue/no-use-v-if-with-v-for': [
      'error',
      {
        allowUsingIterationVar: true // default: false
      }
    ],
    'max-len': [
      'error',
      {
        code: 100,
        ignorePattern: true,
        ignoreUrls: true,
        ignoreStrings: true
      }
    ],
    'no-param-reassign': [
      2,
      {
        props: false
      }
    ]
  }
};
