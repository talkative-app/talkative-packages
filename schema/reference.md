# talkative package reference

Written by every talkative release from the app itself. Do not edit by hand.

## Sound events

| Event | Plays when | Longest file |
| --- | --- | --- |
| `mute` | you mute your microphone | 10 s |
| `unmute` | you unmute your microphone | 10 s |
| `deafen` | you deafen yourself | 10 s |
| `undeafen` | you undeafen yourself | 10 s |
| `camera-on` | your camera turns on | 10 s |
| `camera-off` | your camera turns off | 10 s |
| `stream-watch` | you start watching a stream | 10 s |
| `stream-viewer-join` | someone starts watching your stream | 10 s |
| `stream-viewer-leave` | someone stops watching your stream | 10 s |
| `ring-out` | you call someone and it rings | no limit |
| `ring-in` | someone calls you | no limit |
| `channel-join` | someone joins the voice channel you are in | 10 s |
| `channel-leave` | someone leaves the voice channel you are in | 10 s |
| `self-join` | you join a voice channel or call | 10 s |
| `self-leave` | you leave a voice channel or call | 10 s |
| `stream-start` | you start streaming | 10 s |
| `stream-end` | you stop streaming | 10 s |
| `call-end` | the call you are in ends | 10 s |
| `call-declined` | the person you called declines | 10 s |
| `connection-lost` | the call connection drops | 10 s |
| `connection-back` | the call connection returns | 10 s |
| `message` | a message arrives | 10 s |
| `mention` | someone mentions you | 10 s |
| `direct-message` | a direct message arrives | 10 s |
| `message-sent` | you send a message | 10 s |
| `app-start` | the app starts | 10 s |
| `welcome` | the sign-in screen opens into the app | 10 s |
| `click` | anything clickable, and buttons when the pack has no button-click | 1 s |
| `button-click` | a button is clicked | 1 s |

## Parts

Select them as `[data-part='composer']`.

| Part | Marks |
| --- | --- |
| `window-header` | the bar at the top of the window |
| `window-control` | the minimise, maximise and close buttons |
| `navigation` | the rail of servers and places |
| `place-switch` | the control that switches between places |
| `channel-list` | the channels of a server |
| `channel-row` | one channel in the list |
| `voice-members` | the people inside a voice channel |
| `member-list` | the members of a server |
| `user-panel` | your name, status and call controls under the sidebar |
| `message` | one message |
| `mention` | a mention inside a message |
| `composer` | the box where you write a message |
| `avatar` | the picture of a person |
| `presence-dot` | the status dot of a person |
| `menu` | menus and popovers |
| `dialog` | dialogs |
| `button-primary` | the main button of a dialog or form |
| `field` | a text field |
| `segmented` | a row of choices where one is picked |
| `segmented-option` | one choice in a segmented row; the picked one has data-state="checked" |
| `segmented-highlight` | the highlight that slides behind the picked choice |

## Attributes on the root element

| Attribute | Values | Meaning |
| --- | --- | --- |
| `data-theme` | `dark`, `light` | the mode in use |
| `data-tint` | `servers`, `talk`, `events` | the place the app is in; on any element it sets the hue of --color-accent inside it |
| `data-motion` | `reduced` | set when the person asks for less motion |
| `data-performance` | `on` | set in performance mode |

## Tokens

CSS variables a theme may override. Light shows the value of `data-theme='light'` when it differs.

| Token | Dark | Light |
| --- | --- | --- |
| `--color-canvas` | `#08090d` | `#e4e3ec` |
| `--color-surface` | `#101118` | `#f7f6fa` |
| `--color-raised` | `#161821` | `#ffffff` |
| `--color-field` | `#15161f` | `#eeedf4` |
| `--color-tray` | `#12131b` | `#efeef5` |
| `--color-line` | `rgb(255 255 255 / 0.07)` | `rgb(28 30 60 / 0.09)` |
| `--color-edge` | `rgb(255 255 255 / 0.14)` | `rgb(255 255 255 / 0.9)` |
| `--color-ink-strong` | `#f3f4f9` | `#1b1c2a` |
| `--color-ink` | `#d0d2e0` | `#3e4057` |
| `--color-ink-muted` | `#b0b3c8` | `#5a5c73` |
| `--color-ink-faint` | `#8487a0` | `#626479` |
| `--color-ink-disabled` | `rgb(132 135 160 / 0.6)` | `rgb(98 100 121 / 0.6)` |
| `--color-hover` | `rgb(190 184 255 / 0.07)` | `rgb(28 30 60 / 0.06)` |
| `--color-selected` | `rgb(190 184 255 / 0.11)` | `rgb(28 30 60 / 0.1)` |
| `--color-accent` | `var(--color-tint)` | same |
| `--color-servers` | `var(--tint-servers)` | same |
| `--color-talk` | `var(--tint-talk)` | same |
| `--color-events` | `var(--tint-events)` | same |
| `--color-danger` | `#ef6b6b` | `#c02c2f` |
| `--color-warning` | `#e2b33c` | `#8c5910` |
| `--color-scrim` | `rgb(5 6 12 / 0.6)` | `rgb(30 30 60 / 0.25)` |
| `--color-on-accent` | `#ffffff` | same |
| `--elevation-sm` | `0 10px 30px -16px rgb(6 5 24 / 0.6), inset 0 1px 0 rgb(255 255 255 / 0.04)` | `0 1px 2px rgb(30 30 70 / 0.05), 0 10px 28px -16px rgb(30 30 70 / 0.22)` |
| `--elevation-md` | `0 1px 2px rgb(0 0 0 / 0.5), 0 14px 36px -12px rgb(0 0 0 / 0.7)` | `0 1px 2px rgb(30 30 70 / 0.14), 0 14px 36px -14px rgb(30 30 70 / 0.3)` |
| `--elevation-field` | `0 12px 30px -12px rgb(6 5 24 / 0.65)` | `0 1px 2px rgb(30 30 70 / 0.06)` |
| `--elevation-lg` | `0 2px 4px rgb(0 0 0 / 0.45), 0 28px 64px -16px rgb(0 0 0 / 0.75)` | `0 2px 4px rgb(30 30 70 / 0.12), 0 28px 64px -18px rgb(30 30 70 / 0.34)` |
| `--elevation-tray` | `inset 0 2px 6px -2px rgb(0 0 0 / 0.45), inset 0 1px 0 rgb(255 255 255 / 0.07)` | `inset 0 2px 6px -2px rgb(30 30 70 / 0.12), inset 0 1px 0 rgb(28 30 60 / 0.09)` |
| `--elevation-key` | `inset 0 1px 0 rgb(255 255 255 / 0.07), inset 0 -2px 0 rgb(6 5 24 / 0.35), 0 1px 2px rgb(6 5 24 / 0.35)` | `inset 0 -2px 0 rgb(30 30 70 / 0.1), 0 1px 2px rgb(30 30 70 / 0.12)` |
| `--color-tint` | `var(--tint-servers)` | same |
| `--tint-servers` | `#8a7fdb` | `#6253cf` |
| `--tint-talk` | `#46b57a` | `#227349` |
| `--tint-events-base` | `#4a8be0` | `#2a64bb` |
| `--tint-events` | `var(--tint-events-base)` | same |

## Icons

Replace one as `svg.tabler-icon-microphone > * { display: none }` with a background or mask image from the package.

| Icon | Selector |
| --- | --- |
| `adjustments-horizontal` | `svg.tabler-icon-adjustments-horizontal` |
| `alert-circle` | `svg.tabler-icon-alert-circle` |
| `alert-triangle` | `svg.tabler-icon-alert-triangle` |
| `apple` | `svg.tabler-icon-apple` |
| `arrow-back-up` | `svg.tabler-icon-arrow-back-up` |
| `arrow-down` | `svg.tabler-icon-arrow-down` |
| `arrow-down-left` | `svg.tabler-icon-arrow-down-left` |
| `arrow-left` | `svg.tabler-icon-arrow-left` |
| `arrow-right` | `svg.tabler-icon-arrow-right` |
| `arrow-up-right` | `svg.tabler-icon-arrow-up-right` |
| `arrows-exchange` | `svg.tabler-icon-arrows-exchange` |
| `arrows-maximize` | `svg.tabler-icon-arrows-maximize` |
| `arrows-minimize` | `svg.tabler-icon-arrows-minimize` |
| `arrows-shuffle` | `svg.tabler-icon-arrows-shuffle` |
| `at` | `svg.tabler-icon-at` |
| `ban` | `svg.tabler-icon-ban` |
| `bell` | `svg.tabler-icon-bell` |
| `bell-off` | `svg.tabler-icon-bell-off` |
| `bell-ringing` | `svg.tabler-icon-bell-ringing` |
| `brand-android` | `svg.tabler-icon-brand-android` |
| `brand-apple` | `svg.tabler-icon-brand-apple` |
| `brand-bandcamp` | `svg.tabler-icon-brand-bandcamp` |
| `brand-bluesky` | `svg.tabler-icon-brand-bluesky` |
| `brand-facebook` | `svg.tabler-icon-brand-facebook` |
| `brand-github` | `svg.tabler-icon-brand-github` |
| `brand-gitlab` | `svg.tabler-icon-brand-gitlab` |
| `brand-instagram` | `svg.tabler-icon-brand-instagram` |
| `brand-kick` | `svg.tabler-icon-brand-kick` |
| `brand-linkedin` | `svg.tabler-icon-brand-linkedin` |
| `brand-patreon` | `svg.tabler-icon-brand-patreon` |
| `brand-reddit` | `svg.tabler-icon-brand-reddit` |
| `brand-soundcloud` | `svg.tabler-icon-brand-soundcloud` |
| `brand-spotify` | `svg.tabler-icon-brand-spotify` |
| `brand-steam` | `svg.tabler-icon-brand-steam` |
| `brand-threads` | `svg.tabler-icon-brand-threads` |
| `brand-tiktok` | `svg.tabler-icon-brand-tiktok` |
| `brand-twitch` | `svg.tabler-icon-brand-twitch` |
| `brand-windows` | `svg.tabler-icon-brand-windows` |
| `brand-x` | `svg.tabler-icon-brand-x` |
| `brand-youtube` | `svg.tabler-icon-brand-youtube` |
| `broadcast` | `svg.tabler-icon-broadcast` |
| `bug` | `svg.tabler-icon-bug` |
| `bulb` | `svg.tabler-icon-bulb` |
| `cake` | `svg.tabler-icon-cake` |
| `calendar` | `svg.tabler-icon-calendar` |
| `calendar-check` | `svg.tabler-icon-calendar-check` |
| `calendar-event` | `svg.tabler-icon-calendar-event` |
| `calendar-plus` | `svg.tabler-icon-calendar-plus` |
| `calendar-x` | `svg.tabler-icon-calendar-x` |
| `car` | `svg.tabler-icon-car` |
| `chart-bar` | `svg.tabler-icon-chart-bar` |
| `check` | `svg.tabler-icon-check` |
| `checks` | `svg.tabler-icon-checks` |
| `chevron-down` | `svg.tabler-icon-chevron-down` |
| `chevron-left` | `svg.tabler-icon-chevron-left` |
| `chevron-right` | `svg.tabler-icon-chevron-right` |
| `chevron-up` | `svg.tabler-icon-chevron-up` |
| `circle-check` | `svg.tabler-icon-circle-check` |
| `circle-plus` | `svg.tabler-icon-circle-plus` |
| `clipboard-check` | `svg.tabler-icon-clipboard-check` |
| `clock` | `svg.tabler-icon-clock` |
| `copy` | `svg.tabler-icon-copy` |
| `crown` | `svg.tabler-icon-crown` |
| `database` | `svg.tabler-icon-database` |
| `device-desktop` | `svg.tabler-icon-device-desktop` |
| `device-mobile` | `svg.tabler-icon-device-mobile` |
| `device-mobile-filled` | `svg.tabler-icon-device-mobile-filled` |
| `door-exit` | `svg.tabler-icon-door-exit` |
| `dots` | `svg.tabler-icon-dots` |
| `dots-vertical` | `svg.tabler-icon-dots-vertical` |
| `download` | `svg.tabler-icon-download` |
| `edit` | `svg.tabler-icon-edit` |
| `external-link` | `svg.tabler-icon-external-link` |
| `eye` | `svg.tabler-icon-eye` |
| `eye-off` | `svg.tabler-icon-eye-off` |
| `file` | `svg.tabler-icon-file` |
| `file-code` | `svg.tabler-icon-file-code` |
| `file-music` | `svg.tabler-icon-file-music` |
| `file-text` | `svg.tabler-icon-file-text` |
| `file-typography` | `svg.tabler-icon-file-typography` |
| `file-zip` | `svg.tabler-icon-file-zip` |
| `flag` | `svg.tabler-icon-flag` |
| `fold` | `svg.tabler-icon-fold` |
| `folder` | `svg.tabler-icon-folder` |
| `folder-plus` | `svg.tabler-icon-folder-plus` |
| `gauge` | `svg.tabler-icon-gauge` |
| `hand-stop` | `svg.tabler-icon-hand-stop` |
| `hash` | `svg.tabler-icon-hash` |
| `headphones` | `svg.tabler-icon-headphones` |
| `headphones-off` | `svg.tabler-icon-headphones-off` |
| `headset` | `svg.tabler-icon-headset` |
| `heart` | `svg.tabler-icon-heart` |
| `help-circle` | `svg.tabler-icon-help-circle` |
| `hourglass` | `svg.tabler-icon-hourglass` |
| `id` | `svg.tabler-icon-id` |
| `info-circle` | `svg.tabler-icon-info-circle` |
| `keyboard` | `svg.tabler-icon-keyboard` |
| `layout-navbar-expand` | `svg.tabler-icon-layout-navbar-expand` |
| `leaf` | `svg.tabler-icon-leaf` |
| `link` | `svg.tabler-icon-link` |
| `loader-2` | `svg.tabler-icon-loader-2` |
| `logout` | `svg.tabler-icon-logout` |
| `maximize` | `svg.tabler-icon-maximize` |
| `message-circle` | `svg.tabler-icon-message-circle` |
| `message-circle-minus` | `svg.tabler-icon-message-circle-minus` |
| `message-filled` | `svg.tabler-icon-message-filled` |
| `message-report` | `svg.tabler-icon-message-report` |
| `microphone` | `svg.tabler-icon-microphone` |
| `microphone-off` | `svg.tabler-icon-microphone-off` |
| `minimize` | `svg.tabler-icon-minimize` |
| `minus` | `svg.tabler-icon-minus` |
| `mood-plus` | `svg.tabler-icon-mood-plus` |
| `mood-smile` | `svg.tabler-icon-mood-smile` |
| `moon` | `svg.tabler-icon-moon` |
| `movie` | `svg.tabler-icon-movie` |
| `music` | `svg.tabler-icon-music` |
| `network` | `svg.tabler-icon-network` |
| `package` | `svg.tabler-icon-package` |
| `paperclip` | `svg.tabler-icon-paperclip` |
| `pencil` | `svg.tabler-icon-pencil` |
| `phone` | `svg.tabler-icon-phone` |
| `phone-call` | `svg.tabler-icon-phone-call` |
| `phone-off` | `svg.tabler-icon-phone-off` |
| `phone-x` | `svg.tabler-icon-phone-x` |
| `photo` | `svg.tabler-icon-photo` |
| `photo-plus` | `svg.tabler-icon-photo-plus` |
| `pin` | `svg.tabler-icon-pin` |
| `pinned-off` | `svg.tabler-icon-pinned-off` |
| `player-pause-filled` | `svg.tabler-icon-player-pause-filled` |
| `player-play` | `svg.tabler-icon-player-play` |
| `player-play-filled` | `svg.tabler-icon-player-play-filled` |
| `player-skip-forward` | `svg.tabler-icon-player-skip-forward` |
| `player-skip-forward-filled` | `svg.tabler-icon-player-skip-forward-filled` |
| `player-stop` | `svg.tabler-icon-player-stop` |
| `player-stop-filled` | `svg.tabler-icon-player-stop-filled` |
| `playlist` | `svg.tabler-icon-playlist` |
| `plus` | `svg.tabler-icon-plus` |
| `puzzle` | `svg.tabler-icon-puzzle` |
| `quote` | `svg.tabler-icon-quote` |
| `refresh` | `svg.tabler-icon-refresh` |
| `repeat` | `svg.tabler-icon-repeat` |
| `repeat-once` | `svg.tabler-icon-repeat-once` |
| `rosette-discount-check-filled` | `svg.tabler-icon-rosette-discount-check-filled` |
| `run` | `svg.tabler-icon-run` |
| `screen-share` | `svg.tabler-icon-screen-share` |
| `search` | `svg.tabler-icon-search` |
| `send` | `svg.tabler-icon-send` |
| `server` | `svg.tabler-icon-server` |
| `settings` | `svg.tabler-icon-settings` |
| `shield` | `svg.tabler-icon-shield` |
| `square-rounded` | `svg.tabler-icon-square-rounded` |
| `star` | `svg.tabler-icon-star` |
| `star-filled` | `svg.tabler-icon-star-filled` |
| `sun` | `svg.tabler-icon-sun` |
| `terminal-2` | `svg.tabler-icon-terminal-2` |
| `tool` | `svg.tabler-icon-tool` |
| `trash` | `svg.tabler-icon-trash` |
| `trophy` | `svg.tabler-icon-trophy` |
| `user` | `svg.tabler-icon-user` |
| `user-circle` | `svg.tabler-icon-user-circle` |
| `user-minus` | `svg.tabler-icon-user-minus` |
| `user-plus` | `svg.tabler-icon-user-plus` |
| `users` | `svg.tabler-icon-users` |
| `video` | `svg.tabler-icon-video` |
| `video-off` | `svg.tabler-icon-video-off` |
| `viewport-tall` | `svg.tabler-icon-viewport-tall` |
| `volume` | `svg.tabler-icon-volume` |
| `volume-2` | `svg.tabler-icon-volume-2` |
| `volume-3` | `svg.tabler-icon-volume-3` |
| `volume-off` | `svg.tabler-icon-volume-off` |
| `world` | `svg.tabler-icon-world` |
| `x` | `svg.tabler-icon-x` |
| `zoom-in` | `svg.tabler-icon-zoom-in` |
| `zoom-out` | `svg.tabler-icon-zoom-out` |
| `zoom-scan` | `svg.tabler-icon-zoom-scan` |
