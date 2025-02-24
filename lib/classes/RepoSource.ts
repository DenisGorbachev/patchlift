import type { AsDir } from "../interfaces/AsDir.ts"
import { $ } from "npm:zx@8.3.2"
import type { AsShell } from "../interfaces/AsShell.ts"
import type { AsRepoUrl } from "../interfaces/AsRepoUrl.ts"

export class RepoSource implements AsDir, AsShell, AsRepoUrl {
  private constructor(public repoUrl: string, public dir: string) {
  }

  static async create(repoUrl: string) {
    const dir = await Deno.makeTempDir({
      prefix: "git-clone-",
    })
    await $`git clone --depth 1 ${repoUrl} ${dir}`
    return new RepoSource(repoUrl, dir)
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

  asRepoUrl(): string {
    return this.repoUrl
  }
}

export const createUrlMacroRepoSource = () => RepoSource.create("https://github.com/DenisGorbachev/url-macro")
