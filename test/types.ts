import { convertPackageLock } from '../lib/index.js'

type Object = Record<string, unknown>

const _output: Object = convertPackageLock({}, {}, 1) as Object
const _flag: boolean = convertPackageLock({}, {}, 2, true) as boolean
convertPackageLock({}, {}, 3, false)
