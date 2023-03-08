import { convertPackageLock } from '../lib/index.mjs'
import { readFile } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { strictEqual } from 'assert'
import tehanu from 'tehanu'

const test = tehanu(import.meta.url)
let config, lock1, lock2, lock3

test.before(async () => {
  const dir = dirname(fileURLToPath(import.meta.url))
  const read = async name =>
    JSON.parse(await readFile(join(dir, 'data', `${name}.json`), 'utf8'))
  ;[config, lock1, lock2, lock3] = await Promise.all([
    read('package'), read('package-lock1'), read('package-lock2'), read('package-lock3')
  ])
})

test('recognises version 1', () => {
  strictEqual(convertPackageLock({}, { lockfileVersion: 1 }, 1, true), true)
})

test('recognises version 2', () => {
  strictEqual(convertPackageLock({}, { lockfileVersion: 2 }, 2, true), true)
})

test('recognises version 3', () => {
  strictEqual(convertPackageLock({}, { lockfileVersion: 3 }, 3, true), true)
})

test('ignores the same version 1', () => {
  strictEqual(convertPackageLock({}, { lockfileVersion: 1 }, 1), false)
})

test('ignores the same version 2', () => {
  strictEqual(convertPackageLock({}, { lockfileVersion: 2 }, 2), false)
})

test('ignores the same version 3', () => {
  strictEqual(convertPackageLock({}, { lockfileVersion: 3 }, 3), false)
})

test('converts version 3 to 1', () => {
  const lock = convertPackageLock(config, lock3, 1)
  strictEqual(lock.lockfileVersion, 1)
})

test('converts version 3 to 2', () => {
  const lock = convertPackageLock(config, lock3, 2)
  strictEqual(lock.lockfileVersion, 2)
})

test('converts version 2 to 1', () => {
  const lock = convertPackageLock(config, lock2, 1)
  strictEqual(lock.lockfileVersion, 1)
})

test('converts version 1 to 2', () => {
  const lock = convertPackageLock(config, lock1, 2)
  strictEqual(lock.lockfileVersion, 2)
})

test('converts version 1 to 3', () => {
  const lock = convertPackageLock(config, lock1, 3)
  strictEqual(lock.lockfileVersion, 3)
})
