import { execFileSync } from 'node:child_process';

import { themeChanges } from './lib/theme-changes.ts';

const before = process.env['BEFORE'] ?? '';
const range = /^0*$/.test(before)
  ? ['ls-files', 'packages']
  : ['diff', '--name-only', before, 'HEAD'];
const paths = execFileSync('git', range, { encoding: 'utf8' }).split('\n');

console.log(themeChanges.of(paths).join(' '));
