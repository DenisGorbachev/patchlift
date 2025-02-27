# PatchLift Project Guidelines

## Commands

Always use `mise run ...` commands to run the tests / lints. Do not use `deno test` or `deno check` directly.

- Run tests: `mise run test`
- Run specific test: `mise run test <test_file_path>`
- Format code: `mise run fmt`
- Lint code: `mise run lint`
- Check types: `mise run check`
- Publish: `mise run publish`
- Bump version: `mise run bump`

Always execute `mise run fmt` after making changes to the code.

## Code Style

- No semicolons (see deno.json fmt settings)
- Strict TypeScript mode with exactOptionalPropertyTypes
- Use Deno standard library or npm packages via imports
- Export pattern: constants, classes, and presets from lib folders
- Error handling: Prefer explicit error handling over try/catch
- Prefer single-file modules with focused responsibilities

## Project Structure

- Ignore the files in /base directory
- Implementation classes in [/lib/classes](/lib/classes)
- Constants in [/lib/constants.ts](/lib/constants.ts)
- Execute `mise run test` before committing and fix all test errors
- Execute `mise run lint` before committing and fix all lint errors
- Follow conventional commits (enforced by commitlint)
