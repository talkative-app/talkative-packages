import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { z } from 'zod';

import { packageFiles } from './package-files.ts';

export type PreviewSource = { shots: string; published: Map<string, string[]> };

const SCREENS = ['server-channel', 'direct-message', 'call'];
const MODES = ['light', 'dark'];
const themeSchema = z.object({ modes: z.array(z.string()) });
const catalogSchema = z.object({
  packages: z.array(
    z.object({ manifest: z.object({ id: z.string() }), previews: z.array(z.string()) }),
  ),
});

export class PreviewFiles {
  readonly #fetcher: (url: string) => Promise<Response>;

  constructor(fetcher: (url: string) => Promise<Response> = (url) => fetch(url)) {
    this.#fetcher = fetcher;
  }

  async published(base: string): Promise<Map<string, string[]>> {
    try {
      const response = await this.#fetcher(`${base}/catalog.json`);
      const parsed = catalogSchema.safeParse(response.ok ? await response.json() : null);

      return new Map(
        parsed.success
          ? parsed.data.packages.map(({ manifest, previews }) => [manifest.id, previews])
          : [],
      );
    } catch {
      return new Map();
    }
  }

  async gather(
    base: string,
    folder: string,
    target: string,
    source: PreviewSource,
  ): Promise<string[]> {
    const id = path.basename(folder);
    for (const theme of this.#themes(folder)) {
      const shots = path.join(source.shots, id, theme);
      const into = path.join(target, 'previews', theme);
      if (existsSync(shots)) {
        mkdirSync(into, { recursive: true });
        cpSync(shots, into, { recursive: true });
        continue;
      }
      for (const preview of source.published.get(id) ?? []) {
        if (!preview.startsWith(`previews/${theme}/`)) continue;

        const response = await this.#fetcher(`${base}/packages/${id}/${preview}`);
        if (!response.ok) continue;

        mkdirSync(path.dirname(path.join(target, preview)), { recursive: true });
        writeFileSync(path.join(target, preview), new Uint8Array(await response.arrayBuffer()));
      }
    }

    return this.order(folder, this.#listed(target));
  }

  order(folder: string, previews: string[]): string[] {
    const rank = (preview: string): number => {
      const [, theme = '', file = ''] = preview.split('/');
      const modes = this.#modesOf(folder, theme);
      const [screen, mode] = this.#split(file);

      return (
        this.#themes(folder).indexOf(theme) * 100 +
        SCREENS.indexOf(screen) * 10 +
        modes.indexOf(mode)
      );
    };

    return previews
      .filter((preview) => {
        const [screen, mode] = this.#split(preview.split('/')[2] ?? '');

        return SCREENS.includes(screen) && MODES.includes(mode);
      })
      .toSorted((a, b) => rank(a) - rank(b));
  }

  #split(file: string): [string, string] {
    const name = file.replace(/\.png$/, '');
    const at = name.lastIndexOf('-');

    return [name.slice(0, at), name.slice(at + 1)];
  }

  #listed(target: string): string[] {
    const root = path.join(target, 'previews');
    if (!existsSync(root)) return [];

    return readdirSync(root, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.png'))
      .map((entry) => path.relative(target, path.join(entry.parentPath, entry.name)))
      .map((relative) => relative.split(path.sep).join('/'));
  }

  #themes(folder: string): string[] {
    const themes = path.join(folder, 'themes');

    return existsSync(themes)
      ? readdirSync(themes, { withFileTypes: true })
          .filter((entry) => entry.isDirectory())
          .map((entry) => entry.name)
          .sort()
      : [];
  }

  #modesOf(folder: string, theme: string): string[] {
    const file = path.join('themes', theme, 'theme.json');
    const parsed = existsSync(path.join(folder, file))
      ? themeSchema.safeParse(packageFiles.json(folder, file))
      : null;
    const modes = parsed?.success === true ? parsed.data.modes : MODES;
    const own = MODES.filter((mode) => modes.includes(mode));

    return [...own, ...MODES.filter((mode) => !own.includes(mode))];
  }
}

export const previewFiles = new PreviewFiles();
