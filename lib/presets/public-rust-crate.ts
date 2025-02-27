import { applyPatches } from "../functions.ts"
import { createUrlMacroLocalRepoSource } from "../classes/LocalRepoSource.ts"
import { RUST_PUBLIC_PATCH, RUST_PUBLIC_REMOVE } from "../constants.ts"
import { Target } from "../classes/Target.ts"

const urlMacroSource = await createUrlMacroLocalRepoSource()

export const applyToPublicRustCrate = applyPatches(urlMacroSource, RUST_PUBLIC_PATCH, RUST_PUBLIC_REMOVE)

export const applyToPublicRustCrateDir = async (targetDir: string | undefined) => {
  const target = await Target.create(targetDir)
  return applyToPublicRustCrate(target)
}
