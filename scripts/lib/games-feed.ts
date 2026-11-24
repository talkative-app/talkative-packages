import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import Ajv2020, { type ErrorObject, type ValidateFunction } from 'ajv/dist/2020.js';

import { SCHEMA_FOLDER } from './package-rules.ts';

export type GameFile = { id: string; processes: Record<string, string[]> };

export const GAMES_FOLDER = path.resolve(import.meta.dirname, '../../games');

export class GamesFeed {
  readonly #game: ValidateFunction<GameFile>;

  constructor(schemaFolder = SCHEMA_FOLDER) {
    const schema: object = JSON.parse(
      readFileSync(path.join(schemaFolder, 'games.schema.json'), 'utf8'),
    );
    this.#game = new Ajv2020({ allErrors: true }).compile<GameFile>(schema);
  }

  problems(folder = GAMES_FOLDER): string[] {
    const games = this.#read(folder);
    const owners = new Map<string, string>();
    const clashes = games.flatMap(({ file, value }) => {
      if (!this.#game(value)) return [];

      return Object.entries(value.processes).flatMap(([platform, names]) =>
        names.flatMap((name) => {
          const key = `${platform}:${name.toLowerCase()}`;
          const owner = owners.get(key);
          owners.set(key, owner ?? value.id);

          return owner === undefined || owner === value.id
            ? []
            : [`${file}: ${name} on ${platform} is already ${owner}'s process.`];
        }),
      );
    });

    return [
      ...games.flatMap(({ file, value }) => {
        if (!this.#game(value))
          return (this.#game.errors ?? []).map((e) => this.#describe(file, e));

        return value.id === path.basename(file, '.json')
          ? []
          : [`${file}: the file is named ${file} but the game id is ${value.id}.`];
      }),
      ...clashes,
    ];
  }

  build(folder = GAMES_FOLDER): { games: unknown[] } {
    return {
      games: this.#read(folder).map(({ value }) => {
        const { $schema: _schema, ...game } = Object(value);

        return game;
      }),
    };
  }

  #read(folder: string): { file: string; value: unknown }[] {
    return readdirSync(folder)
      .filter((file) => file.endsWith('.json'))
      .sort()
      .map((file) => ({ file, value: JSON.parse(readFileSync(path.join(folder, file), 'utf8')) }));
  }

  #describe = (file: string, { instancePath, message }: ErrorObject): string =>
    `${file}: ${instancePath === '' ? 'the game' : instancePath} ${message ?? 'is not allowed'}`;
}
