import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';

import { PreviewFiles } from '../lib/preview-files.ts';
import { themeChanges } from '../lib/theme-changes.ts';

const example = path.resolve(import.meta.dirname, '../../packages/example-glass');

describe('previews', () => {
  const shotsOf = (screens: string[]): string => {
    const shots = mkdtempSync(path.join(tmpdir(), 'shots-'));
    mkdirSync(path.join(shots, 'example-glass', 'glass'), { recursive: true });
    for (const screen of screens) {
      writeFileSync(path.join(shots, 'example-glass', 'glass', `${screen}.png`), screen);
    }

    return shots;
  };

  it('New shots are listed with the light server channel first', async () => {
    const target = mkdtempSync(path.join(tmpdir(), 'dist-'));
    const shots = shotsOf(['call-dark', 'server-channel-dark', 'server-channel-light', 'notes']);

    const previews = await new PreviewFiles(() => Promise.reject(new Error('offline'))).gather(
      'https://example.com',
      example,
      target,
      { shots, published: new Map() },
    );

    assert.deepEqual(previews, [
      'previews/glass/server-channel-light.png',
      'previews/glass/server-channel-dark.png',
      'previews/glass/call-dark.png',
    ]);
  });

  it('A theme without new shots keeps the published ones', async () => {
    const target = mkdtempSync(path.join(tmpdir(), 'dist-'));
    const fetched: string[] = [];
    const files = new PreviewFiles((url) => {
      fetched.push(url);

      return Promise.resolve(new Response('published'));
    });

    const previews = await files.gather('https://example.com', example, target, {
      shots: mkdtempSync(path.join(tmpdir(), 'shots-')),
      published: new Map([['example-glass', ['previews/glass/call-light.png']]]),
    });

    assert.deepEqual(fetched, [
      'https://example.com/packages/example-glass/previews/glass/call-light.png',
    ]);
    assert.deepEqual(previews, ['previews/glass/call-light.png']);
    assert.equal(
      readFileSync(path.join(target, 'previews/glass/call-light.png'), 'utf8'),
      'published',
    );
  });

  it('Changed theme files name their package and theme once', () => {
    assert.deepEqual(
      themeChanges.of([
        'packages/example-glass/themes/glass/theme.css',
        'packages/example-glass/themes/glass/glass.png',
        'packages/example-glass/sounds/soft/pack.json',
        'README.md',
      ]),
      ['example-glass/glass'],
    );
  });
});
