import { unique } from "npm:remeda@2.20.2"

export const MISE = ["mise.toml"]
export const LEFTHOOK = ["lefthook.yml"]
export const COMMITLINT = ["commitlint.config.mjs"]
export const BASIC = [...MISE, ...LEFTHOOK, ...COMMITLINT]
export const DENO = ["deno.json"]
export const RUST = ["rustfmt.toml"]
export const LICENSES_APACHE_MIT = ["LICENSE-APACHE", "LICENSE-MIT"]
export const README = ["README.ts", ...DENO]
export const WORKFLOWS_CI = [".github/workflows/ci.yml"]
export const WORKFLOWS_RELEASE_PLZ = [".github/workflows/release-plz.yml"]
export const WORKFLOWS_CI_RELEASE_PLZ = [...WORKFLOWS_CI, ...WORKFLOWS_RELEASE_PLZ]
export const RUST_PUBLIC = unique([
  ...BASIC,
  ...RUST,
  ...README,
  ...WORKFLOWS_CI_RELEASE_PLZ,
  ...LICENSES_APACHE_MIT,
])
export const RUST_PRE_PUBLIC = unique([
  ...BASIC,
  ...RUST,
  ...README,
  ...WORKFLOWS_CI,
  ...LICENSES_APACHE_MIT,
])
