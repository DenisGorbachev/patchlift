#!/usr/bin/env -S deno run --allow-write --allow-read --allow-run=bash,git,cargo --allow-net=docs.rs:443 --allow-env --allow-sys --no-lock

import { COMMITLINT, createUrlMacroRepoSource, LICENSES_APACHE_MIT, Target } from "./index.ts"

const source = await createUrlMacroRepoSource()
const target = await Target.create(import.meta.dirname)

await target.copyAll(source)([
  ...COMMITLINT,
  ...LICENSES_APACHE_MIT,
])
