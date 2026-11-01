# Contributing

Thank you for adding to the official repository. A package is a theme, a sound pack or both.

## A new package

1. Fork the repository, or work on a branch if you can push here.
2. Copy `packages/example` to `packages/<your-id>`; the id is lower case letters, digits and `-`.
3. Edit `manifest.json` ([GUIDE.md](GUIDE.md) explains every field) and add your themes and sounds.
   What you can hook into is in [`schema/reference.md`](schema/reference.md).
4. Run the checks:

   ```sh
   npm ci
   npm run check
   npm test
   ```

5. Open a pull request titled `feat: <your-id> 1.0.0` (see [Titles](#titles)). The `check` job
   runs the same checks on the pull request; the maintainer reviews it.
6. Once merged, `publish` puts the package in `catalog.json` on this repository's Pages address.

## Changing a package

Raise its `version` in `manifest.json`; the check refuses a change without one: the patch number
for a fix, the minor or major number for something new.

## Titles

The pull request title becomes the commit on `main`, and the check holds it to these:

| Pull request                    | Title                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------- |
| A new package                   | `feat: <id> <version>`                                                          |
| A minor or major version        | `feat: <id> <version>`                                                          |
| A patch version                 | `fix: <id> <version>`                                                           |
| Rules, scripts, workflows, docs | `feat:`, `fix:`, `docs:`, `chore:`, `ci:`, `refactor:` or `test:` and a summary |

A package pull request changes only `packages/<id>/`, one package at a time. Every file of a
package lives in `packages/<id>/`; a file anywhere else outside the repository's own folders fails
the check.

## Before you open the pull request

- The work is yours, or you may share it; name its licence in the manifest.
- Only your package's own files: themes use `url('./file')` and `data:` URLs, no remote images,
  fonts or connections.
- A theme lists the modes it styles (`dark`, `light` or both), and looks right in each.
- Sounds are `.ogg` and within the limits of [GUIDE.md](GUIDE.md#limits).
- Previews show the package in the app, with a title each.

## Reporting a problem

Open an issue here for a package. For the app itself, use the app's Send Feedback or
[talkative's issues](https://github.com/talkative-app/talkative/issues).
