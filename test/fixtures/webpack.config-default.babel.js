import { resolve } from 'path';

const { error: sterr } = console;

export default {
  context: __dirname,
  entry: resolve(__dirname, 'entry.js'),
  mode: 'development'
};

sterr('babel-default.js');
