import { applyPatches } from "../functions.ts"
import { createUrlMacroLocalRepoSource } from "../classes/LocalRepoSource.ts"
import { RUST_PRE_PUBLIC_PATCH, RUST_PRE_PUBLIC_REMOVE } from "../constants.ts"
import { Target } from "../classes/Target.ts"

const urlMacroSource = await createUrlMacroLocalRepoSource()

export const applyPatchesToPrePublicRustCrate = applyPatches(urlMacroSource, RUST_PRE_PUBLIC_PATCH, RUST_PRE_PUBLIC_REMOVE)

export const applyPatchesToPrePublicRustCrateDir = async (targetDir: string | undefined) => {
  const target = await Target.create(targetDir)
  return applyPatchesToPrePublicRustCrate(target)
}
