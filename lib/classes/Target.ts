import type { AsDir } from "../interfaces/AsDir.ts"
import { exists } from "jsr:@std/fs@0.224.0"

import { copyAll, copyOne, isGitRepo, isGitRepoClean, lefthookRunPreCommit, lockfile, miseTrust } from "../functions.ts"
import { $ } from "npm:zx@8.3.2"
import type { AsShell } from "../interfaces/AsShell.ts"

export class Target implements AsDir, AsShell {
  private constructor(public dir: string) {
  }

  static async create(dir: string | undefined) {
    if (!dir) throw new Error("Target is required")
    if (!await exists(dir)) throw new Error(`Target must exist: ${dir}`)
    if (!(await Deno.stat(dir)).isDirectory) throw new Error(`Target must be a directory: ${dir}`)
    if (!await isGitRepo(dir)) throw new Error(`Target must be a git repository: ${dir}`)
    if (!await isGitRepoClean(dir)) throw new Error(`Target must be a clean git repository (no uncommitted changes): ${dir}`)
    return new Target(dir)
  }

  toString() {
    return this.dir
  }

  asDir() {
    return this.dir
  }

  asShell() {
    return $({ cwd: this.asDir(), verbose: !!Deno.env.get("PATCHLIFT_VERBOSE") })
  }

  miseTrust() {
    return miseTrust(this.dir)
  }

  lefthookRunPreCommit() {
    return lefthookRunPreCommit(this.dir)
  }

  copyOne(from: AsDir) {
    return copyOne(from, this)
  }

  copyAll(from: AsDir) {
    return copyAll(from, this)
  }

  lockfile() {
    return lockfile(this.dir)
  }
}
