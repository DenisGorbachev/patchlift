// NOTE: Pin the versions of the packages because the script runs without a lock file
import { dirname, SEPARATOR } from "jsr:@std/path@0.224.0"
import { exists } from "jsr:@std/fs@0.224.0/exists"
import { $ } from "npm:zx@8.3.2"

export * from "./constants.ts"

export const isGitRepo = async (dir: string) => {
    const output = await $({ cwd: dir })`git rev-parse --is-inside-work-tree`
    return output.text() === "true"
}

export const ensure = <T>(value: T | null | undefined, err: () => Error) => {
    if (value === null || value === undefined) {
        throw err()
    } else {
        return value
    }
}

export class Target {
    private constructor(public value: string) {}

    static async create(target: string | undefined) {
        if (!target) throw new Error("Target is required")
        if (!await exists(target)) throw new Error(`Target must exist: ${target}`)
        if (!(await Deno.stat(target)).isDirectory) throw new Error(`Target must be a directory: ${target}`)
        if (!await isGitRepo(target)) throw new Error(`Target must contain a git repository: ${target}`)
        return new Target(target)
    }

    toString() {
        return this.value
    }
}

// export const $ = zx.$({ cwd: target.toString() })

export const getSource = async (localPath: string, repoUrl: string) => {
    if (await exists(localPath)) {
        return localPath
    } else {
        const tempDir = await Deno.makeTempDir({
            prefix: "git-clone-",
        })
        await $`git clone --depth 1 ${repoUrl} ${tempDir}`
        return tempDir
    }
}

export const copy = (from: string, to: string) => async (relativePath: string) => {
    const source = from + SEPARATOR + relativePath
    const target = to + SEPARATOR + relativePath
    const targetParent = dirname(target)
    await Deno.mkdir(targetParent, { recursive: true })
    await Deno.copyFile(source, target)
}

export const copyFromSource = (localPath: string, repoUrl: string, target: string) => async (paths: string[]) => {
    const source = await getSource(localPath, repoUrl)
    const cp = copy(source, target)
    return Promise.all(paths.map(cp))
}

export const copyFromUrlMacro = (target: string) => copyFromSource(Deno.env.get("HOME") + "/workspace/url-macro", "https://github.com/DenisGorbachev/url-macro", target)

export const getGitRemoteUrl = (target: string) => $({ cwd: target })`git remote get-url origin`

export const miseTrust = (target: string) => $({ cwd: target })`mise trust ${target}/mise.toml`

// Test that everything works
export const lefthookRunPreCommit = (target: string) => $({ cwd: target })`lefthook run -f pre-commit`
