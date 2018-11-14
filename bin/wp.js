#!/usr/bin/env node

/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const { existsSync } = require('fs');
const path = require('path');

const chalk = require('chalk');
const importLocal = require('import-local');
const parse = require('yargs-parser');
const webpack = require('webpack');

const pkg = require('../package.json');

const { error: stderr } = console;
const end = () => process.exit(0);
const configTypes = {
  function: (c, argv) => Promise.resolve(c(argv.env || {}, argv)),
  object: (c) => Promise.resolve(c)
};
const defaultConfigPath = path.resolve(process.cwd(), 'webpack.config.js');

const help = chalk`
  ${pkg.description}

  {underline Usage}
    $ wp [...options]

  {underline Options}
    --config          A path to a webpack config file
    --config.\{name\}   A path to a webpack config file, and the config name to run
    --help            Displays this message
    --silent          Instruct the CLI to produce no console output
    --version         Displays webpack-nano and webpack versions

  {underline Examples}
    $ wp
    $ wp --help
    $ wp --config webpack.config.js
    $ wp --config.serve webpack.config.js
`;

const doeet = async () => {
  process.on('SIGINT', end);
  process.on('SIGTERM', end);

  const argv = parse(process.argv.slice(2));
  const logPrefix = { ok: chalk.blue('⬡ webpack:'), whoops: chalk.red('⬢ webpack:') };
  const log = {
    error: (...args) => {
      if (argv.silent) return;
      args.unshift(logPrefix.whoops);
      stderr(...args);
    },
    info: (...args) => {
      if (argv.silent) return;
      args.unshift(logPrefix.ok);
      stderr(...args);
    }
  };

  if (argv.help) {
    stderr(help);
    return;
  }

  if (argv.version || argv.v) {
    stderr(`
webpack-nano v${pkg.version}
webpack      v${webpack.version}
`);
    return;
  }

  let config = {};
  let watchConfig;

  if (!argv.config && existsSync(defaultConfigPath)) {
    argv.config = defaultConfigPath;
  }

  // let's not process any config if the user hasn't specified any
  if (argv.config) {
    const configName = typeof argv.config !== 'string' ? Object.keys(argv.config)[0] : null;
    // e.g. --config.batman webpack.config.js
    const configPath = argv.config[configName] || argv.config;
    let configExport = require(path.resolve(configPath)); // eslint-disable-line global-require, import/no-dynamic-require
    const configType = typeof configExport;

    if (configName) {
      if (!Array.isArray(configExport)) {
        throw new TypeError(
          `A config with name was specified, but the config ${configPath} does not export an Array.`
        );
      }

      configExport = configExport.find((c) => c.name === configName);

      if (!configExport) {
        throw new RangeError(`A config with name '${configName}' was not found in ${configPath}`);
      }
    }

    config = await configTypes[configType](configExport, argv);
    watchConfig = [].concat(config).find((c) => !!c.watch);
  }

  const compiler = webpack(config);
  const done = (fatal, stats) => {
    const hasErrors = stats && stats.hasErrors();

    process.exitCode = Number(!!fatal || (hasErrors && !watchConfig));

    if (fatal) {
      log.error(fatal);
      return;
    }

    const defaultStatsOptions = { colors: chalk.supportsColor, exclude: ['node_modules'] };
    const { options = {} } =
      []
        .concat(compiler.compilers || compiler)
        .reduce((a, c) => c.options.stats && c.options.stats) || {};

    const result = stats.toString(options.stats == null ? defaultStatsOptions : options.stats);

    log.info(result);
  };

  if (watchConfig) {
    log.info('Watching Files');
    compiler.watch(watchConfig.watchOptions || {}, done);
  } else {
    compiler.hooks.done.tap('webpack-nano', () => log.info('Build Finished'));
    compiler.run(done);
  }
};

process.on('unhandledRejection', (err) => {
  stderr(err.stack);
  process.exitCode = 1;
});

// eslint-disable-next-line no-unused-expressions
importLocal(__filename) || doeet();
