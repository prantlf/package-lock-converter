#!/usr/bin/env node

const { readFile, writeFile } = require('fs/promises')
const { convertPackageLock } = require('../lib/index.cjs')

function log(message) {
  process.stderr.write(`${message}\n`)
}

function fail(message) {
  log(message)
  process.exit(1)
}

function help() {
  console.log(`${require('../package.json').description}

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
  $ convert-package-lock -3 package-lock-preview.json`)
}

const { argv } = process
let   config = 'package.json', input = 'package-lock.json',
      output, targetVersion, checkOnly, inPlace, prettify = true

for (let i = 2, l = argv.length; i < l; ++i) {
  const arg = argv[i]
  const match = /^(-|--)(no-)?([0-9a-zA-Z][-0-9a-zA-Z]*)(?:=(.*))?$/.exec(arg)
  if (match) {
    const parseArg = (arg, flag) => {
      switch (arg) {
        case 'f': case 'config':
          config = match[4] || argv[++i]
          return
        case 'o': case 'output':
          output = match[4] || argv[++i]
          return
        case 't': case 'to-version':
          targetVersion = match[4] || argv[++i]
          if (targetVersion !== '1' && targetVersion !== '2' && targetVersion !== '3') {
            fail(`invalid target version: "${arg}"`)
          }
          targetVersion = +targetVersion
          return
        case '1': case '2': case '3':
          targetVersion = +arg
          return
        case 'c': case 'check':
          checkOnly = flag
          return
        case 'i': case 'in-place':
          inPlace = flag
          return
        case 'p': case 'prettify':
          prettify = flag
          return
        case 'v': case 'version':
          console.log(require('../package.json').version)
          process.exit(0)
          break
        case 'h': case 'help':
          help()
          process.exit(0)
      }
      fail(`unknown option: "${arg}"`)
    }
    if (match[1] === '-') {
      const flags = match[3].split('')
      for (const flag of flags) parseArg(flag, true)
    } else {
      parseArg(match[3], match[2] !== 'no-')
    }
    continue
  }
  if (arg === '--') {
    input = argv[i + 1]
    break
  }
  input = arg
}

if (!targetVersion) fail('missing target version, add -h for usage instructions')

function readStdIn() {
  return new Promise((resolve, reject) => {
    let source = ''
    const stdin = process.openStdin()
    stdin.setEncoding('utf8')
    stdin
      .on('data', chunk => source += chunk.toString('utf8'))
      .on('end', () => resolve(source))
      .on('error', () => reject(error))
  })
}

async function main() {
  const [pkg, lock] = await Promise.all([
    readFile(config, 'utf8'), input ? readFile(input, 'utf8') : readStdIn()
  ])
  const converted = convertPackageLock(
    JSON.parse(pkg), JSON.parse(lock), targetVersion, checkOnly)

  if (checkOnly) {
    console.log(`${converted ? '' : 'no '}conversion needed`)
    process.exit(0)
  }

  if (converted) {
    if (!output && inPlace && input) output = input
    const target = JSON.stringify(converted, undefined, prettify ? 2 : undefined)
    if (output) await writeFile(output, target)
    else console.log(target)
    log('conversion performed')
  } else {
    log('no conversion needed')
  }
}

main().catch(({ message }) => {
  log(message)
  process.exitCode = 1
})
