# talkative packages

Themes and sound packs for [talkative](https://github.com/talkative-app), installed from the app's
Settings → Packages. This repository is the official one; anyone can start their own from it with
**Use this template**.

## Add a package

1. Copy `packages/example-glass` to `packages/<your-id>` and edit it.
2. Open a pull request. The `check` job tests the package; the maintainer reviews it.
3. Once merged, `publish` puts it in `catalog.json` on this repository's Pages address.

To change a package later, raise its `version`. The check refuses a change without one.

## Layout

```
packages/<id>/
  manifest.json
  cover.png              optional, 16:10
  previews/              optional pictures you list in the manifest
  themes/<theme-id>/     theme.css and the fonts or images it uses
  sounds/<pack-id>/      the .ogg files of the pack
```

`manifest.json`:

```json
{
  "id": "example-glass",
  "name": "Example Glass",
  "author": "talkative",
  "version": "1.0.0",
  "licence": "CC0-1.0",
  "description": "Cool glass panels and two soft sounds.",
  "talkative": ">=0.7",
  "contents": {
    "themes": {
      "glass": { "name": "Glass", "modes": ["dark", "light"], "colors": ["#3a9fe0", "#0b1a2a"] }
    },
    "sounds": {
      "soft": { "name": "Soft", "sounds": { "mention": "chime.ogg", "message-sent": "tap.ogg" } }
    }
  },
  "previews": [{ "file": "previews/channel-dark.png", "title": "Server channel, dark" }]
}
```

| Field             |                                                                                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`              | the folder name: lower case letters, digits and `-`                                                                                                     |
| `name`, `author`  | up to 64 characters each                                                                                                                                |
| `version`         | `major.minor.patch`                                                                                                                                     |
| `licence`         | optional, up to 64 characters                                                                                                                           |
| `description`     | required, up to 400 characters; the package's main text in the app                                                                                      |
| `talkative`       | the app versions it works with, e.g. `>=0.7`                                                                                                            |
| `contents.themes` | theme id → `name`, `modes` (`dark`, `light` or both), `colors` (one to four hex colours shown as dots in the app); the theme is `themes/<id>/theme.css` |
| `contents.sounds` | pack id → `name` and `sounds`, a map from an event to an `.ogg` file in `sounds/<id>/`                                                                  |
| `previews`        | optional, up to eight pictures (png, jpg or webp) with a `title` each                                                                                   |

A package holds at least one theme or sound pack. The cover is `cover.png`; without it the first
preview is the cover, and without previews the app colours the card from the package's id.

Sound events: `mute`, `unmute`, `deafen`, `undeafen`, `camera-on`, `camera-off`, `stream-watch`,
`stream-viewer-join`, `stream-viewer-leave`, `ring-out`, `ring-in`, `channel-join`,
`channel-leave`, `self-join`, `self-leave`, `stream-start`, `stream-end`, `call-end`,
`call-declined`, `connection-lost`, `connection-back`, `message`, `mention`, `direct-message`,
`message-sent`, `app-start`, and three only packs bring: `welcome` (the sign-in screen opens
into the app), `button-click` (a button) and `click` (anything else clickable, and buttons when the
pack has no `button-click`). A pack may leave events out.

## Limits

- A package is at most 5 MB.
- Sounds are `.ogg`, at most 10 s, except `ring-in` and `ring-out`; `click` and `button-click` at
  most 1 s.
- Every file is the manifest, the cover, a listed preview or part of a listed theme or sound pack;
  no hidden files. Every file the manifest names must exist.

## Theming guide

A theme is plain CSS loaded after the app's own styles.

- **Tokens.** Override the CSS variables of talkative's `tokens.css`: surfaces (`--color-canvas`,
  `--color-panel`, `--color-surface`, `--color-surface-raised`, `--color-card`, `--color-field`,
  `--color-menu`), text (`--color-ink-strong`, `--color-ink`, `--color-ink-muted`,
  `--color-ink-faint`), lines (`--color-line`, `--color-edge`), state (`--color-hover`,
  `--color-selected`, `--color-online`, `--color-idle`, `--color-dnd`, `--color-danger`), the tints
  (`--tint-servers`, `--tint-direct`, `--tint-call`) and shadows (`--elevation-*`).
- **Modes.** Style `:root[data-theme='dark']`, `:root[data-theme='light']` or both, and list the
  modes in the manifest. A mode you leave out keeps the default look.
- **Parts.** Stable `data-part` attributes mark the app's parts: `window-header`,
  `window-control`, `navigation`, `place-switch`, `channel-list`, `channel-row`, `voice-members`,
  `member-list`, `user-panel`, `message`, `mention`, `composer`, `avatar`, `presence-dot`, `menu`,
  `dialog`, `button-primary`, `field`. Select them as `[data-part='composer']`. Any other selector
  works at your own risk and may break with an update.
- **Files.** Use only files from your own package: `url('./glass.png')` resolves next to
  `theme.css`, and `data:` URLs work. Remote images, fonts and connections are blocked.
- **Motion.** Stop animations under `:root[data-motion='reduced']` and
  `:root[data-performance='on']`.

## Run it locally

Node 26. The check reads talkative's schemas from a `talkative` folder next to the packages:

```sh
git clone https://github.com/talkative-app/talkative ../talkative
ln -s ../talkative talkative
npm ci
npm run check
npm test
npm run catalog
```

## Your own repository

A copy made with **Use this template** publishes its catalog to its own Pages address (Settings →
Pages → Source: GitHub Actions); add that address in the app with Add Repository…. The check needs
a `TALKATIVE_READ_TOKEN` secret that can read talkative; without it the check is skipped and the
catalog still publishes.
