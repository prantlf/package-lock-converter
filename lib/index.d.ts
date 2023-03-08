type Object = Record<string, unknown>

/**
 * Converts the package lock to other version or check if it needs a conversion.
 * 
 * - If the requested version is the same as the existing one, `false` will be returned.
 * - If `checkOnly` is `true`, a boolean will be returned with the meaning:
 *   `true` = needs conversion and `false` = needs no conversion.
 * - If `checkOnly` is not `true` and the requested version is different
 *   from the existing one, an object with the converted package lock will be returned.
 * 
 * @param config the contents of `package.json`
 * @param lock the contents of `package-lock.json`
 * @param targetVersion the requested target version
 * @param checkOnly do not convert, only check whether a conversion is needed
 */
export function convertPackageLock(config: Object, lock: Object,
  targetVersion: 1 | 2 | 3, checkOnly?: boolean): Object | boolean
