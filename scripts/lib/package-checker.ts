import path from 'node:path';

import { z, type ZodType } from 'zod';

import { packageFiles, type PackageFile } from './package-files.ts';
import type { TalkativeSchemas } from './talkative-schemas.ts';

export class PackageChecker {
  readonly #schemas: TalkativeSchemas;

  constructor(schemas: TalkativeSchemas) {
    this.#schemas = schemas;
  }

  problems(folder: string): string[] {
    const files = packageFiles.list(folder);
    const manifest = this.#parse(
      this.#schemas.packageManifestSchema,
      folder,
      'manifest.json',
      files,
    );
    if (typeof manifest === 'string') return [manifest];

    const id = path.basename(folder);
    const owned = new Set([
      'manifest.json',
      ...(manifest.cover === undefined ? [] : [manifest.cover]),
    ]);
    const problems = [
      ...(manifest.id === id ? [] : [`The folder is ${id} but the manifest id is ${manifest.id}.`]),
      ...files.flatMap((file) => this.#pathProblems(file)),
      ...this.#sizeProblems(files),
      ...(manifest.cover === undefined || this.#has(files, manifest.cover)
        ? []
        : [`The cover ${manifest.cover} is missing.`]),
      ...manifest.themes.flatMap((theme) => this.#themeProblems(folder, files, theme)),
      ...manifest.sounds.flatMap((pack) => this.#soundProblems(folder, files, pack)),
    ];
    const items = [
      ...manifest.themes.map((theme) => `themes/${theme}/`),
      ...manifest.sounds.map((pack) => `sounds/${pack}/`),
    ];
    const strays = files.filter(
      (file) => !owned.has(file.path) && !items.some((item) => file.path.startsWith(item)),
    );

    return [...problems, ...strays.map((file) => `${file.path} is not part of any listed item.`)];
  }

  #themeProblems(folder: string, files: PackageFile[], theme: string): string[] {
    const item = this.#parse(
      this.#schemas.themeItemSchema,
      folder,
      `themes/${theme}/theme.json`,
      files,
    );
    if (typeof item === 'string') return [item];

    return this.#has(files, `themes/${theme}/${item.css}`)
      ? []
      : [`themes/${theme}/${item.css} is missing.`];
  }

  #soundProblems(folder: string, files: PackageFile[], pack: string): string[] {
    const item = this.#parse(
      this.#schemas.soundItemSchema,
      folder,
      `sounds/${pack}/pack.json`,
      files,
    );
    if (typeof item === 'string') return [item];

    return Object.entries(item.sounds).flatMap(([event, file]) => {
      const relative = `sounds/${pack}/${String(file)}`;
      if (!this.#has(files, relative)) return [`${relative} is missing.`];

      const seconds = this.#schemas.oggDuration.seconds(packageFiles.read(folder, relative));
      if (seconds === null) return [`${relative} is not a readable ogg file.`];

      return this.#schemas.oggDuration.tooLong(this.#schemas.soundEventSchema.parse(event), seconds)
        ? [
            `${relative} lasts ${seconds.toFixed(1)} s; sounds are at most ${String(this.#schemas.PACKAGE_LIMITS.soundSeconds)} s.`,
          ]
        : [];
    });
  }

  #pathProblems(file: PackageFile): string[] {
    return this.#schemas.packagePathSchema.safeParse(file.path).success
      ? []
      : [`${file.path} is not an allowed file name.`];
  }

  #sizeProblems(files: PackageFile[]): string[] {
    const bytes = files.reduce((sum, file) => sum + file.bytes, 0);

    return bytes <= this.#schemas.PACKAGE_LIMITS.bytes
      ? []
      : [`The package is ${(bytes / 1024 / 1024).toFixed(1)} MB; packages are at most 5 MB.`];
  }

  #parse<T>(
    schema: ZodType<T>,
    folder: string,
    relative: string,
    files: PackageFile[],
  ): T | string {
    if (!this.#has(files, relative)) return `${relative} is missing.`;

    const parsed = schema.safeParse(this.#json(folder, relative));

    return parsed.success ? parsed.data : `${relative}: ${z.prettifyError(parsed.error)}`;
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
