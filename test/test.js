const { resolve } = require('path');

const test = require('ava');
const execa = require('execa');
const deferred = require('p-defer');

const bin = resolve(__dirname, '../bin/wp.js');
const cwd = resolve(__dirname, './fixtures');

const run = (...args) => execa('node', [bin].concat(args), { cwd });

test('--config', async (t) => {
  const { stderr } = await run('--config', 'webpack.config.js');
  t.truthy(stderr.includes('⬡ webpack: Build Finished'));
});

test('--config.name', async (t) => {
  const { stderr } = await run('--config.yrtne', 'multi.config.js');
  t.truthy(stderr.includes('⬡ webpack: Build Finished'));
});

test('bad', async (t) => {
  try {
    await run('--config', 'bad.config.js');
  } catch (err) {
    t.truthy(err.message.includes('WebpackOptionsValidationError'));
  }
});

test('bad --config.name', async (t) => {
  try {
    await run('--config.ye', 'multi.config.js');
  } catch (err) {
    t.truthy(err.message.includes('RangeError'));
  }
});

test('bad --config.name, non-Array', async (t) => {
  try {
    await run('--config.ye', 'webpack.config.js');
  } catch (err) {
    t.truthy(err.message.includes('TypeError'));
  }
});

test('bail', async (t) => {
  try {
    await run('--config', 'bail.config.js');
  } catch (err) {
    t.truthy(err.message.includes('⬢ webpack: ModuleNotFoundError'));
  }
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
  t.is(stderr, '⬡ webpack: Build Finished\n⬡ webpack:    1 module');
});

test('watch', (t) => {
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
  const { stderr } = await run();
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
  t.snapshot(require('../lib/argv')); // eslint-disable-line global-require
});
