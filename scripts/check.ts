import { readdirSync } from 'node:fs';
import path from 'node:path';

import { gitHistory } from './lib/git-history.ts';
import { PackageChecker } from './lib/package-checker.ts';
import { schemaLoader } from './lib/talkative-schemas.ts';
import { versionBump } from './lib/version-bump.ts';

const schemas = await schemaLoader.load();
if (schemas === null) {
  console.log('::notice::talkative is not checked out next to the packages; skipping the check.');
  process.exit(0);
}

const root = path.resolve(import.meta.dirname, '../packages');
const ids = readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);
const base = process.env['BASE_REF'];
const changed = base === undefined ? new Set<string>() : gitHistory.changedPackages(base);
const checker = new PackageChecker(schemas);

const report = ids.map((id) => {
  const problems = checker.problems(path.join(root, id));
  const after = gitHistory.versionAt('HEAD', id) ?? '0.0.0';
  const bump =
    base !== undefined && changed.has(id)
      ? versionBump.problem(id, gitHistory.versionAt(base, id), after)
      : null;

  return { id, problems: bump === null ? problems : [...problems, bump] };
});

for (const { id, problems } of report) {
  console.log(
    problems.length === 0 ? `✓ ${id}` : `✘ ${id}\n${problems.map((p) => `  - ${p}`).join('\n')}`,
  );
}
process.exit(report.some(({ problems }) => problems.length > 0) ? 1 : 0);
