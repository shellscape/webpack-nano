const { resolve } = require('path');

module.exports = {
  bail: true,
  entry: resolve(__dirname, 'bail.js'),
  mode: 'development'
};
