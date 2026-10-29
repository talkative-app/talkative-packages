import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

export type PackageFile = { path: string; sha256: string; bytes: number };

export class PackageFiles {
  list(folder: string): PackageFile[] {
    return readdirSync(folder, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => path.relative(folder, path.join(entry.parentPath, entry.name)))
      .map((relative) => relative.split(path.sep).join('/'))
      .sort()
      .map((relative) => this.describe(folder, relative));
  }

  read(folder: string, relative: string): Uint8Array {
    return new Uint8Array(readFileSync(path.join(folder, relative)));
  }

  json(folder: string, relative: string): unknown {
    return JSON.parse(readFileSync(path.join(folder, relative), 'utf8'));
  }

  private describe(folder: string, relative: string): PackageFile {
    const bytes = this.read(folder, relative);

    return {
      path: relative,
      sha256: createHash('sha256').update(bytes).digest('hex'),
      bytes: bytes.byteLength,
    };
  }
}

export const packageFiles = new PackageFiles();
