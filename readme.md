# compep [![Build Status](https://travis-ci.org/elzup/compep.svg?branch=master)](https://travis-ci.org/elzup/compep)

> Competitive programming watch client


## Install

```
$ npm install compep
```


## Usage

```js
const compep = require('compep');

compep('unicorns');
//=> 'unicorns & rainbows'
```


## API

### compep(input, [options])

#### input

Type: `string`

Lorem ipsum.

#### options

##### foo

Type: `boolean`<br>
Default: `false`

Lorem ipsum.


## CLI

```
$ npm install --global compep
```

```
$ compep --help

  Usage
    compep [input]

  Options
    --foo  Lorem ipsum [Default: false]

  Examples
    $ compep
    unicorns & rainbows
    $ compep ponies
    ponies & rainbows
```


## License

MIT © [elzup](https://elzup.com)
