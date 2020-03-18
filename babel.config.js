module.exports = {
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-optional-chaining',
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
        helpers: false,
        regenerator: true,
        useESModules: true,
        absoluteRuntime: false
      }
    ]
  ],
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        modules: false,
        useBuiltIns: false
      }
    ],
    '@babel/preset-react'
  ],
  env: {
    test: {
      presets: [
        '@babel/preset-typescript',
        [
          '@babel/preset-env',
          {
            useBuiltIns: false
          }
        ]
      ]
    }
  }
};
