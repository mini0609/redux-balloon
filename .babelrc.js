const { BABEL_ENV, NODE_ENV } = process.env;

module.exports = {
  presets: [
    [
      '@babel/env',
      {
        modules: (BABEL_ENV === 'commonjs' || BABEL_ENV === 'wepy') ? 'cjs' : false,
        loose: true,
        targets: NODE_ENV === 'test' ? { node: 'current' } : {}
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    BABEL_ENV !== 'wepy' && '@babel/plugin-transform-runtime',
    // don't use `loose` mode here - need to copy symbols when spreading
    '@babel/plugin-proposal-object-rest-spread',
    ['@babel/plugin-proposal-class-properties',{"loose": true}],
    NODE_ENV === 'test' && '@babel/transform-modules-commonjs'
  ].filter(Boolean)
};
