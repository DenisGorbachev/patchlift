# Dev notes

- There are multiple repositories
- Some pairs of repositories contain files that are equal
-
- Some config files contain a combination of local properties and shared properties
  - Examples
    - `deno.json` contains `name` and `version` of the package
    - `mise.toml` contains local tools
- Some programs require the configs to be available on disk
  - `mise` requires `mise.toml` to execute the tasks
- A developer may edit the file directly. His/her changes will be overwritten by `setup.ts`.
