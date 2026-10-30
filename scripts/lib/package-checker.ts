import path from 'node:path';

import { oggDuration } from './ogg-duration.ts';
import { packageFiles, type PackageFile } from './package-files.ts';
import type { PackageManifest, PackageRules } from './package-rules.ts';

export class PackageChecker {
  readonly #rules: PackageRules;

  constructor(rules: PackageRules) {
    this.#rules = rules;
  }

  problems(folder: string): string[] {
    const files = packageFiles.list(folder);
    const manifest = this.#manifest(folder, files);
    if (Array.isArray(manifest)) return manifest;

    const { manifestFile, cover } = this.#rules.rules;
    const id = path.basename(folder);
    const themes = Object.keys(manifest.contents.themes ?? {});
    const packs = Object.entries(manifest.contents.sounds ?? {});
    const previews = (manifest.previews ?? []).map((preview) => preview.file);
    const owned = new Set([manifestFile, cover, ...previews]);
    const items = [
      ...themes.map((theme) => `themes/${theme}/`),
      ...packs.map(([pack]) => `sounds/${pack}/`),
    ];
    const strays = files.filter(
      (file) => !owned.has(file.path) && !items.some((item) => file.path.startsWith(item)),
    );

    return [
      ...(manifest.id === id ? [] : [`The folder is ${id} but the manifest id is ${manifest.id}.`]),
      ...(themes.length + packs.length > 0 ? [] : ['The package holds no theme or sound pack.']),
      ...packs
        .filter(([, pack]) => Object.keys(pack.sounds).length === 0)
        .map(([pack]) => `The sound pack ${pack} has no sounds.`),
      ...files
        .filter((file) => !this.#rules.allowedPath(file.path))
        .map((file) => `${file.path} is not an allowed file name.`),
      ...this.#sizeProblems(files),
      ...this.#named(manifest)
        .filter((relative) => !this.#has(files, relative))
        .map((relative) => `${relative} is missing.`),
      ...this.#soundProblems(folder, files, manifest),
      ...strays.map((file) => `${file.path} is not part of any listed item.`),
    ];
  }

  #named(manifest: PackageManifest): string[] {
    return [
      ...Object.keys(manifest.contents.themes ?? {}).map(
        (theme) => `themes/${theme}/${this.#rules.rules.themeFile}`,
      ),
      ...Object.entries(manifest.contents.sounds ?? {}).flatMap(([pack, item]) =>
        Object.values(item.sounds).map((file) => `sounds/${pack}/${file}`),
      ),
      ...(manifest.previews ?? []).map((preview) => preview.file),
    ];
  }

  #soundProblems(folder: string, files: PackageFile[], manifest: PackageManifest): string[] {
    return Object.entries(manifest.contents.sounds ?? {}).flatMap(([pack, item]) =>
      Object.entries(item.sounds).flatMap(([event, file]) => {
        const relative = `sounds/${pack}/${file}`;
        if (!this.#has(files, relative)) return [];

        const seconds = oggDuration.seconds(packageFiles.read(folder, relative));
        if (seconds === null) return [`${relative} is not a readable ogg file.`];

        const limit = oggDuration.limit(this.#rules.rules, event);

        return limit !== null && seconds > limit
          ? [
              `${relative} lasts ${seconds.toFixed(1)} s; ${event} sounds are at most ${String(limit)} s.`,
            ]
          : [];
      }),
    );
  }

  #sizeProblems(files: PackageFile[]): string[] {
    const bytes = files.reduce((sum, file) => sum + file.bytes, 0);
    const most = this.#rules.rules.bytes;

    return bytes <= most
      ? []
      : [
          `The package is ${(bytes / 1024 / 1024).toFixed(1)} MB; packages are at most ${String(most / 1024 / 1024)} MB.`,
        ];
  }

  #manifest(folder: string, files: PackageFile[]): PackageManifest | string[] {
    const relative = this.#rules.rules.manifestFile;
    if (!this.#has(files, relative)) return [`${relative} is missing.`];

    const manifest = this.#rules.manifest(this.#json(folder, relative));

    return Array.isArray(manifest)
      ? manifest.map((problem) => `${relative}: ${problem}`)
      : manifest;
  }

  #json(folder: string, relative: string): unknown {
    try {
      return packageFiles.json(folder, relative);
    } catch {
      return undefined;
    }
  }

  #has(files: PackageFile[], relative: string): boolean {
    return files.some((file) => file.path === relative);
  }
}
