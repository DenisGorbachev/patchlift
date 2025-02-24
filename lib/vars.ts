export function getBooleanEnvVar(key: string) {
  const name = "PATCHLIFT_" + key
  const value = Deno.env.get(name)
  switch (value) {
    case undefined:
    case "false":
    case "0":
    case "no":
      return false
    case "true":
    case "1":
    case "yes":
      return true
    default:
      throw new Error(`Unrecognized boolean env var value for ${name} = ${value}`)
  }
}

export const allowDirty = getBooleanEnvVar("ALLOW_DIRTY")

export const verbose = getBooleanEnvVar("VERBOSE")

export const doApply = !getBooleanEnvVar("SKIP_APPLY")
