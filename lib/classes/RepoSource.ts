import type { AsDir } from "../interfaces/AsDir.ts"
import { $ } from "npm:zx@8.3.2"
import type { AsShell } from "../interfaces/AsShell.ts"
import type { AsRepoUrl } from "../interfaces/AsRepoUrl.ts"
import { verbose } from "../vars.ts"

export class RepoSource implements AsDir, AsShell, AsRepoUrl {
  private constructor(public repoUrl: string, public dir: string) {
  }

  static async create(repoUrl: string) {
    const dir = await Deno.makeTempDir({
      prefix: "git-clone-",
    })
    await $`git clone ${repoUrl} ${dir}`
    return new RepoSource(repoUrl, dir)
  }

  toString() {
    return this.dir
  }

  asDir() {
    return this.dir
  }

  asShell() {
    return $({ cwd: this.asDir(), verbose: verbose })
  }

  asRepoUrl(): string {
    return this.repoUrl
  }
}

export const createUrlMacroRepoSource = () => RepoSource.create("https://github.com/DenisGorbachev/url-macro")
