import { execFileSync } from 'node:child_process';
import { appendFileSync, existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { type Maintained, maintainerRule } from './lib/maintainer-rule.ts';

const repository = process.env['REPO'] ?? '';
const number = process.env['PR'] ?? '';
const root = path.resolve(import.meta.dirname, '../packages');

const gh = (route: string, query = '.'): string =>
  execFileSync('gh', ['api', '--paginate', route, '-q', query], { encoding: 'utf8' }).trim();

const parsed = (text: string): Maintained => {
  const value: unknown = JSON.parse(text);
  if (typeof value !== 'object' || value === null || !('maintainers' in value)) return {};
  const { maintainers } = value;

  return Array.isArray(maintainers)
    ? { maintainers: maintainers.filter((each) => typeof each === 'string') }
    : {};
};

const main = new Map(
  readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(root, entry.name, 'manifest.json'))
    .filter((file) => existsSync(file))
    .map((file) => [path.basename(path.dirname(file)), parsed(readFileSync(file, 'utf8'))]),
);
const author = gh(`repos/${repository}/pulls/${number}`, '.user.login');
const files = gh(`repos/${repository}/pulls/${number}/files`, '.[].filename')
  .split('\n')
  .filter(Boolean);
const proposed = new Map(
  [...new Set(files.map((file) => file.split('/')[1] ?? ''))]
    .filter((id) => !main.has(id))
    .flatMap((id) => {
      try {
        const route = `repos/${repository}/contents/packages/${id}/manifest.json?ref=refs/pull/${number}/head`;
        return [
          [id, parsed(Buffer.from(gh(route, '.content'), 'base64').toString('utf8'))] as const,
        ];
      } catch {
        return [];
      }
    }),
);

const approve = maintainerRule.approves(author, files, main, proposed);
console.log(`${author}: ${approve ? 'maintains every package here' : 'needs a review'}`);
if (process.env['GITHUB_OUTPUT'] !== undefined) {
  appendFileSync(process.env['GITHUB_OUTPUT'], `approve=${String(approve)}\n`);
}
