#!/usr/bin/env -S deno run --allow-write --allow-read --allow-run=bash,git,cargo --allow-net=docs.rs:443 --allow-env --allow-sys --no-lock

import { copyFromUrlMacro, Target } from "./index.ts"
import { BASIC, LICENSES_APACHE_MIT } from "./constants.ts"

const target = await Target.create(import.meta.dirname)

await copyFromUrlMacro(target.toString())([
    ...BASIC,
    ...LICENSES_APACHE_MIT,
])
