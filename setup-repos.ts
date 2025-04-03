#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run

import { parseArgs } from "jsr:@std/cli@1.0.13"
import { $ as shell } from "npm:zx@8.3.2"
import { exists } from "jsr:@std/fs@0.224.0"

const $ = shell({ verbose: true })

// Parse command-line arguments
const args = parseArgs(Deno.args)
const inputFile = args._[0]

if (!inputFile || typeof inputFile !== "string") {
  throw new Error("Missing or invalid input file argument")
}

const dirname = import.meta.dirname
if (!dirname) {
  throw new Error("Could not determine script dirname")
}

const getPackageVersion = async (): Promise<string> => {
  const denoJson = JSON.parse(await Deno.readTextFile("./deno.json"))
  return denoJson.version
}

// Read JSON input
const repositories: [string, string][] = JSON.parse(await Deno.readTextFile(inputFile))
const version = await getPackageVersion()

for (const [repoPath, presetName] of repositories) {
  console.info(`Processing repository: ${repoPath}`)

  // Define the patchlift.ts content with a shebang
  const patchliftContent = `#!/usr/bin/env -S deno run --allow-write --allow-read --allow-run=bash --allow-net --allow-env --allow-sys --no-lock

import { ${presetName} } from "jsr:@dengorbachev/patchlift@${version}"

await ${presetName}(import.meta.dirname)
`

  const patchliftPath = `${repoPath}/patchlift.ts`

  if (await exists(patchliftPath)) {
    throw new Error(`File already exists: ${patchliftPath}`)
  }

  // Write the patchlift.ts file
  await Deno.writeTextFile(patchliftPath, patchliftContent)

  // Make patchlift.ts executable
  await $`chmod +x ${patchliftPath}`

  // Run patchlift.ts as an executable
  await $`${patchliftPath}`

  // Add all changes
  await $`git -C ${repoPath} add .`

  // Commit the changes
  await $`git -C ${repoPath} commit -m "conf: use patchlift"`

  // Push the changes
  await $`git -C ${repoPath} push`
}
