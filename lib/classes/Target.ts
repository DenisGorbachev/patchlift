import { AsDir } from "../interfaces/AsDir.ts"
import { exists } from "jsr:@std/fs@0.224.0"

import { copyAll, copyOne, isGitRepo, lefthookRunPreCommit, miseTrust } from "../functions.ts"

export class Target implements AsDir {
    private constructor(public dir: string) {}

    static async create(dir: string | undefined) {
        if (!dir) throw new Error("Target is required")
        if (!await exists(dir)) throw new Error(`Target must exist: ${dir}`)
        if (!(await Deno.stat(dir)).isDirectory) throw new Error(`Target must be a directory: ${dir}`)
        if (!await isGitRepo(dir)) throw new Error(`Target must contain a git repository: ${dir}`)
        return new Target(dir)
    }

    toString() {
        return this.dir
    }

    asDir() {
        return this.dir
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
}
