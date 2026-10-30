import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';

import { CatalogBuilder } from '../lib/catalog-builder.ts';
import { GitHistory } from '../lib/git-history.ts';
import { PackageChecker } from '../lib/package-checker.ts';
import { PackageRules } from '../lib/package-rules.ts';
import { versionBump } from '../lib/version-bump.ts';

const example = path.resolve(import.meta.dirname, '../../packages/example');
const rules = new PackageRules();

describe('packages', () => {
  const copy = (id = 'example'): string => {
    const folder = path.join(mkdtempSync(path.join(tmpdir(), 'package-')), id);
    cpSync(example, folder, { recursive: true });

    return folder;
  };
  const checker = (): PackageChecker => new PackageChecker(rules);
  const manifestOf = (folder: string): Record<string, unknown> =>
    JSON.parse(readFileSync(path.join(folder, 'manifest.json'), 'utf8'));

  it('The example package passes', () => {
    assert.deepEqual(checker().problems(example), []);
  });

  it('A missing description, a stray file and a hidden file are refused', () => {
    const folder = copy();
    writeFileSync(
      path.join(folder, 'manifest.json'),
      JSON.stringify({ ...manifestOf(folder), description: undefined }),
    );
    assert.match(checker().problems(folder).join('\n'), /manifest\.json/);

    const fresh = copy();
    writeFileSync(path.join(fresh, 'notes.txt'), 'Jane Doe was here');
    writeFileSync(path.join(fresh, 'themes/example/.DS_Store'), '');
    const problems = checker().problems(fresh).join('\n');
    assert.match(problems, /notes\.txt is not part of any listed item/);
    assert.match(problems, /\.DS_Store is not an allowed file name/);
  });

  it('A sound that is not an ogg file or is missing is refused', () => {
    const folder = copy();
    writeFileSync(path.join(folder, 'sounds/example/chime.ogg'), 'not audio');
    const manifest = manifestOf(folder);
    writeFileSync(
      path.join(folder, 'manifest.json'),
      JSON.stringify({
        ...manifest,
        contents: {
          ...(manifest['contents'] as object),
          sounds: {
            example: {
              name: 'Example Sounds',
              sounds: { mention: 'chime.ogg', 'ring-in': 'ring.ogg' },
            },
          },
        },
      }),
    );
    const problems = checker().problems(folder).join('\n');
    assert.match(problems, /chime\.ogg is not a readable ogg file/);
    assert.match(problems, /ring\.ogg is missing/);
  });

  it('A preview is a listed picture, and a picture nobody lists is a stray', () => {
    const folder = copy();
    writeFileSync(
      path.join(folder, 'manifest.json'),
      JSON.stringify({
        ...manifestOf(folder),
        previews: [{ file: 'previews/channel-dark.png', title: 'Server channel, dark' }],
      }),
    );
    assert.match(checker().problems(folder).join('\n'), /previews\/channel-dark\.png is missing/);

    mkdirSync(path.join(folder, 'previews'));
    cpSync(
      path.join(folder, 'sounds/example/tap.ogg'),
      path.join(folder, 'previews/channel-dark.png'),
    );
    writeFileSync(path.join(folder, 'previews/extra.png'), 'png');
    const problems = checker().problems(folder).join('\n');
    assert.doesNotMatch(problems, /channel-dark\.png/);
    assert.match(problems, /previews\/extra\.png is not part of any listed item/);
  });

  it('A package with no theme or sound pack is refused', () => {
    const folder = copy();
    writeFileSync(
      path.join(folder, 'manifest.json'),
      JSON.stringify({ ...manifestOf(folder), contents: {} }),
    );
    assert.match(checker().problems(folder).join('\n'), /holds no theme or sound pack/);
  });

  it('The catalog lists every file with the hash and size of its bytes, and leaves the example out', () => {
    const doe = copy('doe-glass');
    writeFileSync(
      path.join(doe, 'manifest.json'),
      JSON.stringify({ ...manifestOf(doe), id: 'doe-glass' }),
    );
    const catalog = new CatalogBuilder(() => '2026-10-29T12:00:00+01:00').build({
      name: 'talkative-packages',
      base: 'https://example.com/talkative-packages',
      folders: [example, doe],
    }) as {
      packages: {
        manifest: { id: string };
        files: { path: string; sha256: string; bytes: number }[];
      }[];
    };
    assert.equal(catalog.packages.length, 1);
    const [entry] = catalog.packages;
    const chime = entry?.files.find((file) => file.path === 'sounds/example/chime.ogg');
    const bytes = readFileSync(path.join(example, 'sounds/example/chime.ogg'));

    assert.equal(entry?.manifest.id, 'doe-glass');
    assert.equal(chime?.sha256, createHash('sha256').update(bytes).digest('hex'));
    assert.equal(chime?.bytes, bytes.byteLength);
  });
});

describe('history', () => {
  const repository = (): { folder: string; git: (...args: string[]) => string } => {
    const folder = mkdtempSync(path.join(tmpdir(), 'packages-repo-'));
    const git = (...args: string[]): string =>
      execFileSync('git', args, {
        cwd: folder,
        encoding: 'utf8',
        env: {
          ...process.env,
          GIT_AUTHOR_NAME: 'Jane Doe',
          GIT_AUTHOR_EMAIL: 'jane@example.com',
          GIT_COMMITTER_NAME: 'Jane Doe',
          GIT_COMMITTER_EMAIL: 'jane@example.com',
        },
      }).trim();
    git('init', '-q', '-b', 'main');

    return { folder, git };
  };
  const commit = (
    folder: string,
    git: (...args: string[]) => string,
    file: string,
    text: string,
    date: string,
  ): void => {
    writeFileSync(path.join(folder, file), text);
    git('add', '.');
    execFileSync('git', ['commit', '-q', '-m', file], {
      cwd: folder,
      env: {
        ...process.env,
        GIT_AUTHOR_NAME: 'Jane Doe',
        GIT_AUTHOR_EMAIL: 'jane@example.com',
        GIT_COMMITTER_NAME: 'Jane Doe',
        GIT_COMMITTER_EMAIL: 'jane@example.com',
        GIT_AUTHOR_DATE: date,
        GIT_COMMITTER_DATE: date,
      },
    });
  };

  it('A package is released when its version was last set, not when it last changed', () => {
    const { folder, git } = repository();
    execFileSync('mkdir', ['-p', path.join(folder, 'packages/doe')]);
    commit(
      folder,
      git,
      'packages/doe/manifest.json',
      '{\n  "version": "1.0.0"\n}\n',
      '2026-10-01T10:00:00+00:00',
    );
    commit(
      folder,
      git,
      'packages/doe/manifest.json',
      '{\n  "version": "1.1.0"\n}\n',
      '2026-10-10T10:00:00+00:00',
    );
    commit(folder, git, 'packages/doe/notes.css', 'a {}', '2026-10-20T10:00:00+00:00');

    const history = new GitHistory(folder);
    assert.equal(history.releasedAt('doe'), '2026-10-10T10:00:00Z');
    assert.equal(history.versionAt('HEAD~2', 'doe'), '1.0.0');
    assert.deepEqual([...history.changedPackages('HEAD~1')], ['doe']);
  });

  it('A changed package needs a higher version', () => {
    assert.equal(versionBump.problem('doe', null, '1.0.0'), null);
    assert.equal(versionBump.problem('doe', '1.0.0', '1.0.1'), null);
    assert.equal(versionBump.problem('doe', '1.9.0', '1.10.0'), null);
    assert.match(versionBump.problem('doe', '1.2.0', '1.2.0') ?? '', /above 1\.2\.0/);
    assert.match(versionBump.problem('doe', '2.0.0', '1.9.9') ?? '', /above 2\.0\.0/);
  });
});
