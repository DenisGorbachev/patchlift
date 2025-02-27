import type { InputOptions } from "jsr:@cliffy/prompt@1.0.0-rc.7"
import { Input } from "jsr:@cliffy/prompt@1.0.0-rc.7"

export async function getBooleanInput(options: string | InputOptions) {
  const answer = await Input.prompt(options)
  return answer === "" || answer === "Y"
}
