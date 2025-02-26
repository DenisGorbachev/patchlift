import type { AsShell } from "./AsShell.ts"
import type { AsRepoUrl } from "./AsRepoUrl.ts"
import type { AsDir } from "./AsDir.ts"

export interface SourceLike extends AsShell, AsRepoUrl, AsDir {
}
