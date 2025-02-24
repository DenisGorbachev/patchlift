import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts"

export class RepoPathCommit {
  private constructor(public repo: string, public path: string, public commit: string) {}

  toPlain(): RepoPathCommitObject {
    return {
      repo: this.repo,
      path: this.path,
      commit: this.commit,
    }
  }

  static create(repo: string, path: string, commit: string) {
    return new RepoPathCommit(repo, path, commit)
  }

  static createFromObject({ repo, path, commit }: RepoPathCommitObject) {
    return RepoPathCommit.create(repo, path, commit)
  }

  static createManyFromJSON(input: unknown[]) {
    const objects = RepoPathCommitObjectsSchema.parse(input)
    return objects.map(RepoPathCommit.createFromObject)
  }
}

export const RepoPathCommitObjectSchema = z.object({
  repo: z.string(),
  path: z.string(),
  commit: z.string().length(40),
})

export const RepoPathCommitObjectsSchema = z.array(RepoPathCommitObjectSchema)

export type RepoPathCommitObject = z.infer<typeof RepoPathCommitObjectSchema>
