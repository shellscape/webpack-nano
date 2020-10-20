const { join, resolve } = require('path');

const test = require('ava');
const execa = require('execa');
const deferred = require('p-defer');

const bin = resolve(__dirname, '../bin/wp.js');
const cwd = resolve(__dirname, './fixtures');

const run = (...args) => execa('node', [bin].concat(args), { cwd });

test('no config', async (t) => {
  const { stderr } = await run();
  t.truthy(stderr.includes('⬡ webpack: Build Finished'));
});

test('--config', async (t) => {
  const { stderr } = await run('--config', 'webpack.config.js');
  t.truthy(stderr.includes('⬡ webpack: Build Finished'));
});

test('--config.name', async (t) => {
  const { stderr } = await run('--config.yrtne', 'multi.config.js');
  t.truthy(stderr.includes('⬡ webpack: Build Finished'));
});

test('esm', async (t) => {
  const { stderr } = await run('--config', 'webpack.config.esm.js');
  t.truthy(stderr.includes('esm'));
  t.truthy(stderr.includes('⬡ webpack: Build Finished'));
});

test('esm default export', async (t) => {
  const { stderr } = await run('--config', 'webpack.config-default.esm.js');
  t.truthy(stderr.includes('esm-default'));
  t.truthy(stderr.includes('⬡ webpack: Build Finished'));
});

test('babel', async (t) => {
  const { stderr } = await run('--config', 'webpack.config.babel.js');
  t.truthy(stderr.includes('babel'));
  t.truthy(stderr.includes('⬡ webpack: Build Finished'));
});

test('babel default export', async (t) => {
  const { stderr } = await run('--config', 'webpack.config-default.babel.js');
  t.truthy(stderr.includes('babel-default'));
  t.truthy(stderr.includes('⬡ webpack: Build Finished'));
});

test('bad', async (t) => {
  try {
    await run('--config', 'bad.config.js');
  } catch (err) {
    // Same subset for webpack 4 and 5
    t.truthy(err.stderr.includes('ValidationError'));
  }
});

test('bad --config.name', async (t) => {
  try {
    await run('--config.ye', 'multi.config.js');
  } catch (err) {
    t.truthy(err.stderr.includes('RangeError'));
  }
});

test('bad --config.name, non-Array', async (t) => {
  try {
    await run('--config.ye', 'webpack.config.js');
  } catch (err) {
    t.truthy(err.stderr.includes('TypeError'));
  }
});

test('bail', async (t) => {
  try {
    await run('--config', 'bail.config.js');
  } catch (err) {
    t.truthy(err.stderr.includes('⬢ webpack: ModuleNotFoundError'));
  }
});

test('es6', async (t) => {
  const { stderr } = await run('--config', 'webpack.config.es6');
  t.truthy(stderr.includes('es6'));
  t.truthy(stderr.includes('⬡ webpack: Build Finished'));
});

test('fn', async (t) => {
  const { stderr } = await run('--config', 'fn.config.js');
  t.truthy(stderr.includes('⬡ webpack: Build Finished'));
});

test('multi', async (t) => {
  const { stderr } = await run('--config', 'multi.config.js');
  t.truthy(stderr.includes('⬡ webpack: Build Finished'));
});

test('stats', async (t) => {
  const { stderr } = await run('--config', 'stats.config.js');

  // Same subset for webpack 4 and 5
  t.truthy(stderr.includes('webpack'));
});

test('json', async (t) => {
  const { stdout } = await run('--config', 'stats.config.js', '--json');
  const stats = JSON.parse(stdout);

  // Remove times since those are transient
  delete stats.time;
  delete stats.builtAt;
  delete stats.outputPath;
  delete stats.chunks;
  delete stats.modules;

  // Remove properties that aren't common in webpack 4 and 5
  delete stats.assets;
  delete stats.assetsByChunkName;
  delete stats.entrypoints;
  delete stats.errorsCount;
  delete stats.filteredAssets;
  delete stats.filteredModules;
  delete stats.hash;
  delete stats.logging;
  delete stats.namedChunkGroups;
  delete stats.publicPath;
  delete stats.version;
  delete stats.warningsCount;

  t.snapshot(stats);
});

test.serial('watch', (t) => {
  t.timeout(5000);
  const defer = deferred();
  const proc = run('--config', 'watch.config.js');

  setTimeout(async () => {
    proc.kill();
    const { stderr } = await proc;
    t.truthy(stderr.includes('⬡ webpack: Watching Files'));
    defer.resolve();
  }, 2000);

  return defer.promise;
});

test('zero config', async (t) => {
  const { stderr } = await execa('node', [bin], { cwd: join(cwd, '/zero') });
  t.truthy(stderr.includes('⬡ webpack: Build Finished'));
});

test('--help', async (t) => {
  const { stderr } = await run('--help');
  t.snapshot(stderr);
});

test('--silent, info', async (t) => {
  const { stderr } = await run('--config', 'webpack.config.js', '--silent');
  t.falsy(stderr);
});

test('--silent, error', async (t) => {
  try {
    await run('--config', 'bail.config.js', '--silent');
  } catch (err) {
    t.falsy(err.stderr);
  }
});

test('--version', async (t) => {
  const { stderr } = await run('--version');
  t.regex(stderr, /v\d{1,2}\.\d{1,2}\.\d{1,2}/i);
});

test('argv export', (t) => {
  t.snapshot(require('../argv')); // eslint-disable-line global-require
});
