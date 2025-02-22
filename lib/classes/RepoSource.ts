import { AsDir } from "../interfaces/AsDir.ts"
import { exists } from "jsr:@std/fs@0.224.0"
import { $ } from "npm:zx@8.3.2"

export class RepoSource implements AsDir {
    private constructor(public dir: string) {
    }

    static async create(localPath: string, repoUrl: string) {
        if (await exists(localPath)) {
            return new RepoSource(localPath)
        } else {
            const repoDir = await Deno.makeTempDir({
                prefix: "git-clone-",
            })
            await $`git clone --depth 1 ${repoUrl} ${repoDir}`
            return new RepoSource(repoDir)
        }
    }

    toString() {
        return this.dir
    }

    asDir() {
        return this.dir
    }
}

export const createUrlMacroRepoSource = () => RepoSource.create(Deno.env.get("HOME") + "/workspace/url-macro", "https://github.com/DenisGorbachev/url-macro")
