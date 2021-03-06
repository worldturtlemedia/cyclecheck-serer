import { diff, gt, SemVer, valid } from 'semver'

import { isDev } from '../config/environment'

/**
 * This version is set by the release process, and should not be touched.
 */
export const GENERATED_VERSION: string = '__GENERATED__'

export const DEV_DEFAULT = '1.0.0'

export function getVersion({
  defaultVersion = DEV_DEFAULT,
  isDevMode = isDev(),
} = {}) {
  if (isDevMode) return `${defaultVersion}-dev`

  const packageVersion = tryRequireVersion()
  const checkVersion = packageVersion || GENERATED_VERSION

  if (!valid(checkVersion)) {
    throw new Error(
      'Something went wrong and the version was never set!' +
      'Was not able to manually get version from package.json' +
      'Run in dev mode to bypass, or pass --dev',
    )
  }

  return GENERATED_VERSION
}

export function compare(
  newVersion: string | SemVer,
  current: string = getVersion(),
) {
  if (!gt(newVersion, current)) return null

  return diff(current, newVersion)
}

function tryRequireVersion(): string | null {
  try {
    return require('../../package.json').version
  } catch (error) {
    // no-op
  }

  return null
}
