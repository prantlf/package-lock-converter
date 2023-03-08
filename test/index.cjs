const { convertPackageLock } = require('..')
const { strictEqual } = require('assert')
const test = require('tehanu')(__filename)

test('exports all methods', () => {
  strictEqual(typeof convertPackageLock, 'function')
})
