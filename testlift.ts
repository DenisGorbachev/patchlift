#!/usr/bin/env -S deno run --allow-write --allow-read --allow-run=bash --allow-net --allow-env --allow-sys --no-lock

import { applyToPublicRustCrateDir } from "./index.ts"
import { $ } from "npm:zx@8.3.2"

const temp = await Deno.makeTempDir({
  prefix: "testlift",
})
console.info(temp)

const shell = $({ cwd: temp })
await shell`git init`

await applyToPublicRustCrateDir(temp)

console.info(temp)
