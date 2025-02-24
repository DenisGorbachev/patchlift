import type { ProcessPromise, Shell } from "npm:zx@8.3.2"

export interface AsShell {
  asShell: () => Shell<false, ProcessPromise>
}
