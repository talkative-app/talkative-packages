import { cpSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { CatalogBuilder } from './lib/catalog-builder.ts';
import { GamesFeed } from './lib/games-feed.ts';
import { gitHistory } from './lib/git-history.ts';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const builder = new CatalogBuilder((id) => gitHistory.releasedAt(id));
const folders = builder.published(
  readdirSync(path.join(root, 'packages'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(root, 'packages', entry.name)),
);
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

const catalog = builder.build({
  name: process.env['CATALOG_NAME'] ?? repository,
  base,
  folders,
});
writeFileSync(path.join(dist, 'catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`);
const games = new GamesFeed().build();
writeFileSync(path.join(dist, 'games.json'), `${JSON.stringify(games, null, 2)}\n`);
console.log(`games.json lists ${String(games.games.length)} games`);
console.log(`catalog.json lists ${String(folders.length)} packages under ${base}`);
