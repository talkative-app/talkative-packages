import { existsSync } from 'node:fs';
import path from 'node:path';

export type TalkativeSchemas = typeof import('../../talkative/packages/schemas/src/index.ts');

export type PackageManifest =
  import('../../talkative/packages/schemas/src/index.ts').PackageManifest;

export const TALKATIVE_SCHEMAS = path.resolve(
  import.meta.dirname,
  '../../talkative/packages/schemas/src/index.ts',
);

export class SchemaLoader {
  async load(): Promise<TalkativeSchemas | null> {
    if (!existsSync(TALKATIVE_SCHEMAS)) return null;

    return (await import(TALKATIVE_SCHEMAS)) as TalkativeSchemas;
  }
}

export const schemaLoader = new SchemaLoader();
