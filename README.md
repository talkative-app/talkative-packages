# talkative packages

Themes and sound packs for [talkative](https://github.com/talkative-app), installed from the app's
Settings → Packages. This repository is the official one; anyone can start their own from it with
**Use this template**.

## Add a package

1. Copy `packages/example` to `packages/<your-id>` and edit it. The example shows everything a
   package can do; it is checked like any package but never published.
2. Open a pull request. The `check` job tests the package; the maintainer reviews it.
3. Once merged, `publish` puts it in `catalog.json` on this repository's Pages address.

To change a package later, raise its `version`. The check refuses a change without one.
[CONTRIBUTING.md](CONTRIBUTING.md) walks through it.

## Read more

| File                                       |                                                                                       |
| ------------------------------------------ | ------------------------------------------------------------------------------------- |
| [CONTRIBUTING.md](CONTRIBUTING.md)         | how to contribute a package or a fix                                                  |
| [GUIDE.md](GUIDE.md)                       | layout, the manifest, limits and how a theme is written                               |
| [schema/reference.md](schema/reference.md) | sound events, parts, root attributes and tokens a package can hook into, from the app |

## Run it locally

Node 26. The check follows the rules in `schema/`: `manifest.schema.json` (the manifest as JSON
Schema) and `rules.json` (file names, size and sound lengths); `reference.md` lists what a
package can hook into. Every talkative release writes them here, so they always match the newest
app.

```sh
npm ci
npm run check
npm test
npm run catalog
```

## Your own repository

A copy made with **Use this template** publishes its catalog to its own Pages address (Settings →
Pages → Source: GitHub Actions); add that address in the app with Add Repository…. Its `schema/` stays as it was copied; copy the
folder from this repository again to follow a newer talkative.
