const { resolve } = require('path');

module.exports = [
  {
    context: __dirname,
    entry: resolve(__dirname, 'entry.js'),
    mode: 'development',
    name: 'entry',
    output: {
      filename: 'nahmain.js'
    }
  },
  {
    context: __dirname,
    entry: resolve(__dirname, 'yrtne.js'),
    mode: 'production',
    name: 'yrtne'
  }
];
