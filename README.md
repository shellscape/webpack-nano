[tests]: 	https://img.shields.io/circleci/project/github/shellscape/webpack-nano.svg
[tests-url]: https://circleci.com/gh/shellscape/webpack-nano

[cover]: https://codecov.io/gh/shellscape/webpack-nano/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/shellscape/webpack-nano

[size]: https://packagephobia.now.sh/badge?p=webpack-nano
[size-url]: https://packagephobia.now.sh/result?p=webpack-nano

<div align="center">
	<img width="256" src="https://raw.githubusercontent.com/shellscape/webpack-nano/master/assets/nano.svg?sanitize=true" alt="webpack-nano"><br/><br/>
</div>

# webpack-nano [![tests][tests]][tests-url] [![cover][cover]][cover-url] [![size][size]][size-url] [![libera manifesto](https://img.shields.io/badge/libera-manifesto-lightgrey.svg)](https://liberamanifesto.com)


A teensy, squeaky 🐤 clean Webpack CLI

`webpack-nano` operates on the premise that all options for configuring a webpack build are set via a [config file](https://webpack.js.org/configuration/).

## Install

Using npm:

```console
npm install webpack-nano --save-dev
```

<a href="https://www.patreon.com/shellscape">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

## Requirements

`webpack-nano` is an evergreen module. 🌲 This module requires an [Active LTS](https://github.com/nodejs/Release) Node version (v10.0.0+).

## Benefits

- Holy bananas 🍌 it's itsy bitsy
- Doesn't hit you over the head with an avalanche of flags and options
- Allows any number of user-defined flags
- It does one thing: tells webpack to start a build
- ~90% smaller than webpack-cli and webpack-command

## Usage

```console
$ npx wp --help

  Usage
    $ wp [...options]

  Options
    --config          A path to a webpack config file
    --config.{name}   A path to a webpack config file, and the config name to run
    --json            Emit bundle information as JSON
    --help            Displays this message
    --silent          Instruct the CLI to produce no console output
    --version         Displays webpack-nano and webpack versions

  Examples
    $ wp
    $ wp --help
    $ wp --config webpack.config.js
    $ wp --config.serve webpack.config.js
```

## Custom Flags

With `webpack-cli` users are limited as to the flags they can use on with the `$ webpack` binary, and are instructed to use the `--env` flag for custom data. Well that's just 🍌🍌. With `webpack-nano` users can specify an unlimited number of custom flags, _without restriction_.

Say you have a bundle which can be built to use different asset locations from cloud data sources, like Amazon S3 or Google Cloud Storage. And in this scenario you prefer to specify that location using a command-line flag. If you were using `webpack-cli`, you'd have to use the `--env.source` flag (or you'd get a big 'ol error) and use a function for your `webpack.config.js` export. Using `webpack-nano`:

```console
$ wp --config webpack.config.js --source s3
```

```js
// webpack.config.js
const argv = require('webpack-nano/argv');

const { source } = argv;

module.exports = {
  ...
}
```

✨ Magic. The `webpack-nano/argv` export provides quick and easy access to parsed command-line arguments, allowing the user to define the CLI experience as they want to.

## Special Configuration File Types

Webpack configuration files can be written using a variety of module loaders. e.g. Babel or TypeScript. `webpack-nano` allows users to use file types like `webpack.config.babel.js`, `webpack.config.es6`, `webpack.config.mjs`, and `webpack.config.ts`. Users are responsible for installing a compatible module loader when using these special file types. The table below represents the supported file types and their compatible loaders:

| Extension   | Compatible Loaders |
| ------------| ------------------ |
| `.babel.js` | `@babel/register`, `babel-register`, `babel-core/register`, `babel/register` |
| `.babel.ts` | `@babel/register`  |
| `.es6`      | `@babel/register`  |
| `.mjs`      | `@babel/register`  |
| `.ts`       | `ts-node/register`, `typescript-node/register`, `typescript-register`, `typescript-require` |

## Build Stats

This project attempts not to make assumptions about how a build should behave, and that includes webpack [`stats`](https://webpack.js.org/configuration/stats/). By default, `webpack-nano` will apply two `stats` options: `colors` (based on [`supports-color`](https://github.com/chalk/supports-color) and `exclude: ['node_modules']`). These can be quickly overridden by including these key/values in your stats configuration.

## Meta

[CONTRIBUTING](./.github/CONTRIBUTING.md)

[LICENSE (Mozilla Public License)](./LICENSE)
