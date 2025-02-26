import { exists } from "jsr:@std/fs@0.224.0"
import { RepoSource } from "./RepoSource.ts"
import { $ } from "npm:zx@8.3.2"
import { verbose } from "../vars.ts"
import type { SourceLike } from "../interfaces/SourceLike.ts"

export class LocalRepoSource implements SourceLike {
  private constructor(public localDir: string, public repoUrl: string, public rs: RepoSource | undefined) {
  }

  static async create(localDir: string, repoUrl: string) {
    if (await exists(localDir)) {
      return new LocalRepoSource(localDir, repoUrl, undefined)
    } else {
      const rs = await RepoSource.create(repoUrl)
      return new LocalRepoSource(localDir, repoUrl, rs)
    }
  }

  toString() {
    return this.asDir()
  }

  asDir() {
    return this.rs ? this.rs.asDir() : this.localDir
  }

  asShell() {
    return $({ cwd: this.asDir(), verbose: verbose })
  }

  asRepoUrl(): string {
    return this.repoUrl
  }
}

export const createUrlMacroLocalRepoSource = () => LocalRepoSource.create(Deno.env.get("HOME") + "/workspace/url-macro", "https://github.com/DenisGorbachev/url-macro")
