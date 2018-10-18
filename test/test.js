const { join, resolve } = require('path');

const test = require('ava');
const execa = require('execa');
const { fromFile: hasha } = require('hasha');

const bin = resolve(__dirname, '../bin/wp');
const cwd = resolve(__dirname, './fixtures');

const hash = (file = 'main.js') => hasha(join(__dirname, `/fixtures/dist/${file}`));
const run = (...args) => execa('node', [bin].concat(args), { cwd });

test('--help', async (t) => {
  const { stderr } = await run('--help');
  t.snapshot(stderr);
});

test('--version', async (t) => {
  const { stderr } = await run('--version');
  t.snapshot(stderr);
});

test('--config', async (t) => {
  const { stderr } = await run('--config', 'webpack.config.js');
  t.truthy(stderr.includes('⬡ webpack: Build Finished'));
  t.snapshot(await hash());
});

test('--config.name', async (t) => {
  const { stderr } = await run('--config.yrtne', 'multi.config.js');
  t.truthy(stderr.includes('⬡ webpack: Build Finished'));
  t.snapshot(await hash());
});

test('bad', async (t) => {
  try {
    await run('--config', 'bad.config.js');
  } catch (err) {
    t.truthy(err.message.includes('WebpackOptionsValidationError'));
  }
});

test('bail', async (t) => {
  const { stderr } = await run('--config', 'bail.config.js');
  t.truthy(stderr.includes('⬢ webpack: ModuleNotFoundError'));
});

test('multi', async (t) => {
  const { stderr } = await run('--config', 'multi.config.js');
  t.truthy(stderr.includes('⬡ webpack: Build Finished'));
  t.snapshot(await hash('nahmain.js'));
  t.snapshot(await hash());
});

test('zero config', async (t) => {
  const { stderr } = await run();
  t.truthy(stderr.includes('⬡ webpack: Build Finished'));
  t.snapshot(await hash());
});
