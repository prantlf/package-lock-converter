function entryToV1(entry) {
  const { version, resolved, integrity, dependencies, dev } = entry
  return {
    version,
    resolved,
    integrity,
    requires: dependencies,
    dependencies: {}, // missing in v2
    dev
  }
}

function entryToV2(entry) {
  const { version, resolved, integrity, license, requires, dev, engines, bin } = entry
  return {
    version,
    resolved,
    integrity,
    license, // missing in v1
    dependencies: requires,
    dev,
    engines, // missing in v1
    bin // missing in v1
  }
}

function dependenciesToV1(packages) {
  const dependencies = {}
  for (const key in packages) {
    if (key.startsWith('node_modules/')) {
      dependencies[key.substring(13)] = entryToV1(packages[key])
    }
  }
  return dependencies
}

function dependenciesToV2(config, deps) {
  const {
    dependencies, devDependencies, peerDependencies, optionalDependencies
  } = config
  const packages = {
    '': {
      dependencies, devDependencies, peerDependencies, optionalDependencies
    }
  }
  for (const key in deps) {
    packages[`node_modules/${key}`] = entryToV2(deps[key])
  }
  return packages
}

export function convertPackageLock(config, lock, targetVersion, checkOnly) {
  let {
    name, // v1, v2, v3
    version, // v1, v2, v3
    lockfileVersion, // v1, v2, v3
    requires, // v1, v2, v3
    dependencies, // v1
    license, // v2, v2, v3
    workspaces, // v2, v3
    devDependencies, // v2, v3
    optionalDependencies, // v2, v3
    packages // v2, v3
  } = lock

  if (checkOnly) return targetVersion === lockfileVersion
  if (targetVersion === lockfileVersion) return false

  let output
  switch (targetVersion) {
    case 1:
      dependencies = dependenciesToV1(packages)
      output = { name, version, lockfileVersion: 1, requires, dependencies }
      break;
    case 2:
      if (lockfileVersion === 1) packages = dependenciesToV2(config, dependencies)
      output = {
        name, version, lockfileVersion: 2, requires, license, packages,
        workspaces, devDependencies, optionalDependencies
      }
      break;
    default: // 3
      if (lockfileVersion === 1) packages = dependenciesToV2(config, dependencies)
      output = {
        name, version, lockfileVersion: 3, requires, license, packages,
        workspaces, devDependencies, optionalDependencies
      }
  }
 
  return output
}
