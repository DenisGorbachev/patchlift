import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts"
import { RepoPathCommit, RepoPathCommitObjectsSchema } from "./RepoPathCommit.ts"

export class Lockfile {
  public rpcs: RepoPathCommit[]

  constructor(public object: LockfileObject) {
    switch (object.version) {
      case 1:
        this.rpcs = object.rpcs.map(RepoPathCommit.createFromObject)
        break
      default:
        throw new Error(`Unrecognized lockfile version: ${object.version}`)
    }
  }

  static fromString(input: string) {
    // pass `undefined` to trigger Zod's `default` method
    const data = input.length ? JSON.parse(input) : undefined
    return new Lockfile(LockfileObjectSchema.parse(data))
  }

  toObject(): LockfileObjectV1 {
    return LockfileObjectV1Schema.parse({
      version: 1,
      rpcs: this.rpcs,
    })
  }

  toString() {
    return JSON.stringify(this.toObject(), undefined, 2)
  }
}

export const LockfileObjectV1Schema = z.object({ version: z.literal(1), rpcs: RepoPathCommitObjectsSchema })

export type LockfileObjectV1 = z.infer<typeof LockfileObjectV1Schema>

export const LockfileObjectSchema = z.discriminatedUnion("version", [
  LockfileObjectV1Schema,
]).default({
  version: 1,
  rpcs: [],
})

export type LockfileObject = z.infer<typeof LockfileObjectSchema>
