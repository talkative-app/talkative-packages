import path from 'node:path';

import { z } from 'zod';

import { packageFiles, type PackageFile } from './package-files.ts';
import type { PackageManifest, TalkativeSchemas } from './talkative-schemas.ts';

export class PackageChecker {
  readonly #schemas: TalkativeSchemas;

  constructor(schemas: TalkativeSchemas) {
    this.#schemas = schemas;
  }

  problems(folder: string): string[] {
    const files = packageFiles.list(folder);
    const manifest = this.#manifest(folder, files);
    if (typeof manifest === 'string') return [manifest];

    const { PACKAGE_COVER, PACKAGE_MANIFEST_FILE, packageContents } = this.#schemas;
    const id = path.basename(folder);
    const owned = new Set([
      PACKAGE_MANIFEST_FILE,
      PACKAGE_COVER,
      ...manifest.previews.map((preview) => preview.file),
    ]);
    const items = [
      ...packageContents.themes(manifest).map((theme) => `themes/${theme}/`),
      ...packageContents.sounds(manifest).map((pack) => `sounds/${pack}/`),
    ];
    const strays = files.filter(
      (file) => !owned.has(file.path) && !items.some((item) => file.path.startsWith(item)),
    );

    return [
      ...(manifest.id === id ? [] : [`The folder is ${id} but the manifest id is ${manifest.id}.`]),
      ...files.flatMap((file) => this.#pathProblems(file)),
      ...this.#sizeProblems(files),
      ...packageContents.missing({ manifest, files }).map((relative) => `${relative} is missing.`),
      ...this.#soundProblems(folder, files, manifest),
      ...strays.map((file) => `${file.path} is not part of any listed item.`),
    ];
  }

  #soundProblems(folder: string, files: PackageFile[], manifest: PackageManifest): string[] {
    const { oggDuration, soundEventSchema, PACKAGE_LIMITS } = this.#schemas;

    return Object.entries(manifest.contents.sounds).flatMap(([pack, item]) =>
      Object.entries(item.sounds).flatMap(([event, file]) => {
        const relative = `sounds/${pack}/${String(file)}`;
        if (!this.#has(files, relative)) return [];

        const seconds = oggDuration.seconds(packageFiles.read(folder, relative));
        if (seconds === null) return [`${relative} is not a readable ogg file.`];

        return oggDuration.tooLong(soundEventSchema.parse(event), seconds)
          ? [
              `${relative} lasts ${seconds.toFixed(1)} s; sounds are at most ${String(PACKAGE_LIMITS.soundSeconds)} s.`,
            ]
          : [];
      }),
    );
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

  #manifest(folder: string, files: PackageFile[]): PackageManifest | string {
    const relative = this.#schemas.PACKAGE_MANIFEST_FILE;
    if (!this.#has(files, relative)) return `${relative} is missing.`;

    const parsed = this.#schemas.packageManifestSchema.safeParse(this.#json(folder, relative));

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
