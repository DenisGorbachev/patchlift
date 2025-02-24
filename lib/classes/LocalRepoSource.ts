import type { AsDir } from "../interfaces/AsDir.ts"
import { exists } from "jsr:@std/fs@0.224.0"
import { RepoSource } from "./RepoSource.ts"

export class LocalRepoSource implements AsDir {
  private constructor(public localDir: string, public rs: RepoSource | undefined) {}

  static async create(localDir: string, repoUrl: string) {
    if (await exists(localDir)) {
      return new LocalRepoSource(localDir, undefined)
    } else {
      const rs = await RepoSource.create(repoUrl)
      return new LocalRepoSource(localDir, rs)
    }
  }

  toString() {
    return this.asDir()
  }

  asDir() {
    return this.rs ? this.rs.asDir() : this.localDir
  }
}

export const createUrlMacroLocalRepoSource = () => LocalRepoSource.create(Deno.env.get("HOME") + "/workspace/url-macro", "https://github.com/DenisGorbachev/url-macro")
