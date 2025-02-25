import { unique } from "npm:remeda@2.20.2"

export const MISE = ["mise.toml"]
export const LEFTHOOK = ["lefthook.yml"]
export const COMMITLINT = ["commitlint.config.mjs"]
export const BASIC = [...MISE, ...LEFTHOOK, ...COMMITLINT]
export const DENO = ["deno.json"]
export const RUST = ["rustfmt.toml"]
export const LICENSES_APACHE_MIT = ["LICENSE-APACHE", "LICENSE-MIT"]
export const README = ["README.ts", ...DENO]
// all workflows in the directory, including ci.yml and release-plz.yml
export const WORKFLOWS = [".github/workflows"]
export const RUST_PUBLIC = unique([
  ...BASIC,
  ...RUST,
  ...README,
  ...WORKFLOWS,
  ...LICENSES_APACHE_MIT,
])
