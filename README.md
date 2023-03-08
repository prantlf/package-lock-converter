# package-lock-converter

[![Latest version](https://img.shields.io/npm/v/package-lock-converter)
 ![Dependency status](https://img.shields.io/librariesio/release/npm/package-lock-converter)
](https://www.npmjs.com/package/package-lock-converter)
[![Coverage](https://codecov.io/gh/prantlf/package-lock-converter/branch/master/graph/badge.svg)](https://codecov.io/gh/prantlf/package-lock-converter)

Converts the NPM package lock to the version 1, 2 or 3. There may be tools, which don't support the latest version.

**Warning:** This is experimental and still in development. Only the conversion to the package lock version 1 works now and only partially.

### Synopsis

    $ npx package-lock-converter -3c
    no conversion needed

    $ npm i -g package-lock-converter
    $ convert-package-lock -1
    {
      "lockfileVersion": "1",
      ...
    }

## Command-line usage

Make sure that you have [Node.js] >= 14.8 installed. Install the `package-lock-converter` package globally using your favourite package manager to be able to generate and parse build numbers by running `convert-package-lock` from any directory in `PATH`:

    $ npm i -g package-lock-converter
    $ pnpm i -g package-lock-converter
    $ yarn global add package-lock-converter

Running `convert-package-lock --help` prints usage instructions:

    Usage: convert-package-lock [options] [--] [<file>]

    Options:
      -f, --config <file>     read package configuration from the specified file
      -o, --output <file>     write to the specified package lock file
      -t, --to-version <num>  convert the package lock to the specified version
      -1|2|3                  convert the package lock to the specified version
      -c, --check-only        only check if the package lock needs a conversion
      -i, --in-place          modify the input file instead of printing the result
      -p, --[no-]prettify     format a human readable output (default)
      -V, --version           print the version number
      -h, --help              print the usage instructions

    The target version is a mandatory option. The default file name of the package
    configuration is "package.json". The default file name of the package lock is
    "package-lock.json". If "--" is the last argument, the package lock content
    will be read from the standard input.

    Examples:
      $ convert-package-lock -1i
      $ convert-package-lock -3 package-lock-preview.json

## API

Bundles for [Node.js] ([CJS], and [ESM]) are available, incusing [TypeScript]. They export the function for performing the package lock version conversion.

```js
import { readFile, writeFile } from 'fs/promises'
import { convertPackageLock } from 'package-lock-converter'

// Load the contents of the package configuration and package lock files
const [config, lock] = await Promise.all([
  readFile('package.json', 'utf8'), readFile('package-lock.json', 'utf8')
])

// Convert the package lock to the version 1 and print the result,
// if the package lock needed the conversion
const result = convertPackageLock(JSON.parse(config), JSON.parse(lock), 1)
if (result) console.log(result)
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.  Add unit tests for any new or changed functionality. Lint and test your code using `npm test`.

## License

Copyright (c) 2023 Ferdinand Prantl

Licensed under the MIT license.

[Node.js]: https://nodejs.org/
[CJS]: https://blog.risingstack.com/node-js-at-scale-module-system-commonjs-require/#commonjstotherescue
[ESM]: https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/#content-head
[TypeScript]: https://www.typescriptlang.org/
