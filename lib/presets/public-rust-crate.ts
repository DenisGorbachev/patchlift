import { applyPatches } from "../functions.ts"
import { createUrlMacroLocalRepoSource } from "../classes/LocalRepoSource.ts"
import { RUST_PUBLIC } from "../constants.ts"

const source = await createUrlMacroLocalRepoSource()
export const applyToPublicRustCrate = applyPatches(source, RUST_PUBLIC)
