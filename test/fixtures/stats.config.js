const { resolve } = require('path');

module.exports = {
  context: __dirname,
  entry: resolve(__dirname, 'entry.js'),
  mode: 'development',
  stats: 'minimal'
};
