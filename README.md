# egg-enhance-session

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-enhance-session.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-enhance-session
[travis-image]: https://img.shields.io/travis/eggjs/egg-enhance-session.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-enhance-session
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-enhance-session.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-enhance-session?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-enhance-session.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-enhance-session
[snyk-image]: https://snyk.io/test/npm/egg-enhance-session/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-enhance-session
[download-image]: https://img.shields.io/npm/dm/egg-enhance-session.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-enhance-session

<!--
Description here.
-->

## Install

```bash
$ npm i egg-enhance-session --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.enhanceSession = {
  enable: true,
  package: 'egg-enhance-session',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.enhanceSession = {
};
```
And support all [egg-cookies](https://github.com/eggjs/egg-cookies/blob/master/README.zh-CN.md) params.

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/xxmyjk/egg-enhance-session/issues).

## License

[MIT](LICENSE)
