const { resolve } = require('path');

module.exports = () => {
  return {
    context: __dirname,
    entry: resolve(__dirname, 'entry.js'),
    mode: 'development'
  };
};
