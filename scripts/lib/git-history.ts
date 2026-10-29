import { execFileSync } from 'node:child_process';

import { z } from 'zod';

const versionedSchema = z.object({ version: z.string() });

export class GitHistory {
  readonly #cwd: string;

  constructor(cwd = process.cwd()) {
    this.#cwd = cwd;
  }

  changedPackages(base: string): Set<string> {
    const names = this.#git(['diff', '--name-only', `${base}...HEAD`, '--', 'packages']);

    return new Set(
      names
        .split('\n')
        .filter((name) => name.startsWith('packages/'))
        .map((name) => name.split('/')[1]),
    );
  }

  versionAt(ref: string, id: string): string | null {
    try {
      const manifest: unknown = JSON.parse(
        this.#git(['show', `${ref}:packages/${id}/manifest.json`]),
      );
      const parsed = versionedSchema.safeParse(manifest);

      return parsed.success ? parsed.data.version : null;
    } catch {
      return null;
    }
  }

  releasedAt(id: string): string {
    try {
      return this.#versionDate(id) || new Date().toISOString();
    } catch {
      return new Date().toISOString();
    }
  }

  #versionDate(id: string): string {
    const dates = this.#git([
      'log',
      '--format=%cI',
      '-G',
      '"version"',
      '--',
      `packages/${id}/manifest.json`,
    ]);

    return dates.split('\n')[0] ?? '';
  }

  #git(args: string[]): string {
    return execFileSync('git', args, {
      cwd: this.#cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  }
}

export const gitHistory = new GitHistory();
