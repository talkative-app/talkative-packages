import path from 'node:path';

import { packageFiles } from './package-files.ts';

export type CatalogInput = {
  name: string;
  base: string;
  folders: string[];
};

export class CatalogBuilder {
  readonly #releasedAt: (id: string) => string;

  constructor(releasedAt: (id: string) => string) {
    this.#releasedAt = releasedAt;
  }

  build({ name, base, folders }: CatalogInput): unknown {
    return {
      name,
      base,
      packages: folders.map((folder) => {
        const id = path.basename(folder);

        return {
          manifest: packageFiles.json(folder, 'manifest.json'),
          released: this.#releasedAt(id),
          files: packageFiles.list(folder),
        };
      }),
    };
  }
}
