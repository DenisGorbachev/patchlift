import { applyPatches } from "../functions.ts"
import { createUrlMacroLocalRepoSource } from "../classes/LocalRepoSource.ts"
import { RUST_PUBLIC } from "../constants.ts"
import { Target } from "../classes/Target.ts"

const urlMacroSource = await createUrlMacroLocalRepoSource()

export const applyToPublicRustCrate = applyPatches(urlMacroSource, RUST_PUBLIC)

export const applyToPublicRustCrateDir = async (targetDir: string | undefined) => {
  const target = await Target.create(targetDir)
  return applyPatches(urlMacroSource, RUST_PUBLIC)(target)
}
