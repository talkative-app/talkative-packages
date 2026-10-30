import { cpSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { CatalogBuilder } from './lib/catalog-builder.ts';
import { gitHistory } from './lib/git-history.ts';
import { schemaLoader } from './lib/talkative-schemas.ts';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const folders = readdirSync(path.join(root, 'packages'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(root, 'packages', entry.name));
const repository = process.env['GITHUB_REPOSITORY']?.split('/')[1] ?? path.basename(root);
const base = (process.env['CATALOG_BASE'] ?? 'https://example.com/talkative-packages').replace(
  /\/$/,
  '',
);

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
for (const folder of folders) {
  cpSync(folder, path.join(dist, 'packages', path.basename(folder)), { recursive: true });
}

const catalog = new CatalogBuilder((id) => gitHistory.releasedAt(id)).build({
  name: process.env['CATALOG_NAME'] ?? repository,
  base,
  folders,
});
const schemas = await schemaLoader.load();
const checked = schemas === null ? catalog : schemas.catalogSchema.parse(catalog);

writeFileSync(path.join(dist, 'catalog.json'), `${JSON.stringify(checked, null, 2)}\n`);
console.log(`catalog.json lists ${String(folders.length)} packages under ${base}`);
