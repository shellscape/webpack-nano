const parse = require('yargs-parser');

const argv = parse(process.argv.slice(2));

module.exports = argv;
