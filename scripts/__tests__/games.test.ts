import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';

import { GamesFeed } from '../lib/games-feed.ts';

describe('games', () => {
  const feed = new GamesFeed();
  const copy = (): string => mkdtempSync(path.join(tmpdir(), 'games-'));
  const game = {
    id: 'doe-arena',
    name: 'Doe Arena',
    category: 'competitive',
    processes: { darwin: [], win32: ['DoeArena.exe'], linux: [] },
  };

  it('The games in the repository pass', () => {
    assert.deepEqual(feed.problems(), []);
  });

  it('An unknown category or trigger id is refused', () => {
    const folder = copy();
    writeFileSync(
      path.join(folder, 'doe-arena.json'),
      JSON.stringify({ ...game, category: 'arcade', triggers: [{ id: 'doe.win' }] }),
    );
    const problems = feed.problems(folder).join('\n');
    assert.match(problems, /doe-arena\.json: \/category/);
    assert.match(problems, /doe-arena\.json: \/triggers\/0\/id/);
  });

  it('A file named apart from its id or a process another game owns is refused', () => {
    const folder = copy();
    writeFileSync(path.join(folder, 'doe.json'), JSON.stringify(game));
    writeFileSync(
      path.join(folder, 'jane-arena.json'),
      JSON.stringify({ ...game, id: 'jane-arena' }),
    );
    const problems = feed.problems(folder).join('\n');
    assert.match(problems, /doe\.json: the file is named doe\.json but the game id is doe-arena/);
    assert.match(
      problems,
      /jane-arena\.json: DoeArena\.exe on win32 is already doe-arena's process/,
    );
  });

  it('The feed lists every game without its editor schema link', () => {
    const folder = copy();
    writeFileSync(
      path.join(folder, 'doe-arena.json'),
      JSON.stringify({ $schema: '../schema/games.schema.json', ...game }),
    );
    assert.deepEqual(feed.build(folder), { games: [game] });
  });
});
