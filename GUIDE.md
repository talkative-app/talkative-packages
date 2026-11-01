# Package guide

What a package holds, what the check demands and how a theme is written. What a package can hook
into (sound events, parts, root attributes, tokens) is listed in
[`schema/reference.md`](schema/reference.md), written by every talkative release.

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
  "$schema": "../../schema/manifest.schema.json",
  "id": "doe-glass",
  "name": "Doe Glass",
  "author": "Jane Doe",
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
| `$schema`         | optional; with it your editor completes and checks the manifest                                                                                         |
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

Every sound event, with when it plays and how long its file may be, is in
[`schema/reference.md`](schema/reference.md).

## Limits

- A package is at most 5 MB.
- Sounds are `.ogg`, at most 10 s, except `ring-in` and `ring-out`; `click` and `button-click` at
  most 1 s.
- Every file is the manifest, the cover, a listed preview or part of a listed theme or sound pack;
  no hidden files. Every file the manifest names must exist.

## Theming guide

A theme is plain CSS loaded after the app's own styles.

- **Tokens.** Override the CSS variables of talkative's `tokens.css`. The full list, with the dark and
  light value of each, is in [`schema/reference.md`](schema/reference.md#tokens).
- **Modes.** Style `:root[data-theme='dark']`, `:root[data-theme='light']` or both, and list the
  modes in the manifest. A mode you leave out keeps the default look.
- **Parts.** Stable `data-part` attributes mark the app's parts; select them as
  `[data-part='composer']`. The list is in [`schema/reference.md`](schema/reference.md#parts). Any
  other selector works at your own risk and may break with an update. The root element also
  carries `data-theme`, `data-context`, `data-motion` and `data-performance`.
- **Files.** Use only files from your own package: `url('./frost.svg')` resolves next to
  `theme.css`, and `data:` URLs work. Remote images, fonts and connections are blocked.
- **Motion.** Stop animations under `:root[data-motion='reduced']` and
  `:root[data-performance='on']`.
