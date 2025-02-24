#!/usr/bin/env -S deno run --allow-write --allow-read --allow-run=bash,git,cargo --allow-net=docs.rs:443 --allow-env --allow-sys --no-lock

import { COMMITLINT, createUrlMacroLocalRepoSource, LICENSES_APACHE_MIT, Target } from "./index.ts"
import { applyPatches } from "./lib/functions.ts"

const source = await createUrlMacroLocalRepoSource()
const target = await Target.create(import.meta.dirname)

await applyPatches(source, [
  ...COMMITLINT,
  ...LICENSES_APACHE_MIT,
])(target)
