import { $ } from "npm:zx@8.3.2"
import type { AsDir } from "./interfaces/AsDir.ts"
import { dirname, SEPARATOR } from "jsr:@std/path@0.224.0"
import { readAll } from "jsr:@std/io@0.225.2"
import type { Target } from "./classes/Target.ts"
import { RepoPathCommit } from "./classes/RepoPathCommit.ts"
import type { AsShell } from "./interfaces/AsShell.ts"
import type { AsRepoUrl } from "./interfaces/AsRepoUrl.ts"
import { doApply } from "./vars.ts"

export const isGitRepo = async (dir: string) => {
  const output = await $({ cwd: dir })`git rev-parse --is-inside-work-tree`
  return output.text().trim() === "true"
}

export const isGitRepoClean = async (dir: string) => {
  const output = await $({ cwd: dir })`git status --porcelain`
  return output.text().trim() === ""
}

export const ensure = <T>(value: T | null | undefined, err: () => Error) => {
  if (value === null || value === undefined) {
    throw err()
  } else {
    return value
  }
}

export function stub<T>(message = "Implement me"): T {
  throw new Error(message)
}

export const copyOne = (from: AsDir, to: AsDir) => async (path: string) => {
  const source = from.asDir() + SEPARATOR + path
  const target = to.asDir() + SEPARATOR + path
  const targetParent = dirname(target)
  await Deno.mkdir(targetParent, { recursive: true })
  await Deno.copyFile(source, target)
}

export const copyAll = (from: AsDir, to: AsDir) => (paths: string[]) => Promise.all(paths.map(copyOne(from, to)))

export const getGitRemoteUrl = (target: string) => $({ cwd: target })`git remote get-url origin`

export const miseTrust = (target: string) => $({ cwd: target })`mise trust ${target}/mise.toml`

// Test that everything works
export const lefthookRunPreCommit = (target: string) => $({ cwd: target })`lefthook run -f pre-commit`

export const lockfile = (dir: string) => dir + SEPARATOR + "patchlift.lock"

export const withFile = async (path: string, callback: (contentOld: string) => Promise<string>) => {
  using file = await Deno.open(path, { read: true, write: true, create: true })
  await file.lock(true)
  const decoder = new TextDecoder("utf-8")
  const contentOldArray = await readAll(file)
  const contentOldString = decoder.decode(contentOldArray)
  const encoder = new TextEncoder()
  const contentNewString = await callback(contentOldString)
  const contentNewArray = encoder.encode(contentNewString)
  await file.truncate()
  await file.write(contentNewArray)
  await file.unlock()
}

interface ApplyPatchSource extends AsShell, AsRepoUrl {
}

// source & paths are needed (we can't read them from lockfile) because the user should set them in `patchlift.ts`, not in `patchlift.lock`
// TODO: extend RepoPathCommit to Branch
export const applyPatches = (source: ApplyPatchSource, paths: string[]) => async (target: Target) => {
  const targetSh = target.asShell()
  const sourceSh = source.asShell()
  const sourceHead = (await sourceSh`git rev-parse HEAD`).text().trim()
  await withFile(target.lockfile(), async (contentOld) => {
    const rpcs = contentOld ? RepoPathCommit.createManyFromJSON(JSON.parse(contentOld)) : []
    // const repos = rpcs.map(rpc => rpc.repo)
    // const sources = await Promise.all(repos.map(RepoSource.create))
    const promises = paths.map(async (path) => {
      // NOTE: Can't ask for user input in this function because it is called by `withFile`, which must
      const rpc = rpcs.find((rpc) => rpc.repo === source.asRepoUrl() && rpc.path === path)
      console.log("rpc", rpc)
      const rootFlag = rpc ? "" : "--root"
      const revisionRange = rpc ? `${rpc.commit}..${sourceHead}` : sourceHead
      console.log("revisionRange", revisionRange)
      const formatPatchProcessOutput = await sourceSh`git format-patch --stdout ${rootFlag} ${revisionRange} -- ${path}`
      const patch = formatPatchProcessOutput.text()
      console.log("patch", patch)
      const patchFilePath = await Deno.makeTempFile({
        prefix: "patch",
      })
      console.log("patchFilePath", patchFilePath)
      await Deno.writeTextFile(patchFilePath, patch)
      const action = doApply ? `Applying patch from ${patchFilePath} on ${path}.` : `Skipping patch on ${path} (assuming it was already applied).`
      const answer = prompt(`${action} Continue? (Y/n)`)
      if (answer === "" || answer === "Y") {
        if (doApply) {
          await targetSh`git apply ${patchFilePath}`
        }
        if (rpc) {
          rpc.commit = sourceHead
        } else {
          rpcs.push(RepoPathCommit.create(source.asRepoUrl(), path, sourceHead))
        }
      }
    })
    await Promise.all(promises)
    return JSON.stringify(rpcs, undefined, 2)
  })
}
