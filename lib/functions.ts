import { $ } from "npm:zx@8.3.2"
import type { AsDir } from "./interfaces/AsDir.ts"
import { dirname, SEPARATOR } from "jsr:@std/path@0.224.0"

export const isGitRepo = async (dir: string) => {
  const output = await $({ cwd: dir })`git rev-parse --is-inside-work-tree`
  return output.text().trim() === "true"
}

export const ensure = <T>(value: T | null | undefined, err: () => Error) => {
  if (value === null || value === undefined) {
    throw err()
  } else {
    return value
  }
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
