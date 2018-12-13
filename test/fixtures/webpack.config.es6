import { resolve } from 'path';

const { error: sterr } = console;

module.exports = {
  context: __dirname,
  entry: resolve(__dirname, 'entry.js'),
  mode: 'development'
};

sterr('es6');
