import { readFileSync } from 'node:fs';
import path from 'node:path';

import Ajv2020, { type ErrorObject, type ValidateFunction } from 'ajv/dist/2020.js';

export type RuleSet = {
  manifestFile: string;
  cover: string;
  themeFile: string;
  bytes: number;
  soundSeconds: number;
  clickSeconds: number;
  longEvents: string[];
  clickEvents: string[];
  filePath: object;
};

export type PackageManifest = {
  id: string;
  contents: {
    themes?: Record<string, object>;
    sounds?: Record<string, { sounds: Record<string, string> }>;
  };
  previews?: { file: string }[];
};

export const SCHEMA_FOLDER = path.resolve(import.meta.dirname, '../../schema');

export class PackageRules {
  readonly rules: RuleSet;
  readonly #manifest: ValidateFunction<PackageManifest>;
  readonly #filePath: ValidateFunction;

  constructor(folder = SCHEMA_FOLDER) {
    const read = (name: string): object =>
      JSON.parse(readFileSync(path.join(folder, name), 'utf8'));
    const ajv = new Ajv2020({ allErrors: true });
    this.rules = read('rules.json') as RuleSet;
    this.#manifest = ajv.compile<PackageManifest>(read('manifest.schema.json'));
    this.#filePath = ajv.compile(this.rules.filePath);
  }

  manifest(value: unknown): PackageManifest | string[] {
    return this.#manifest(value) ? value : (this.#manifest.errors ?? []).map(this.#describe);
  }

  allowedPath(relative: string): boolean {
    return this.#filePath(relative);
  }

  #describe = ({ instancePath, message }: ErrorObject): string =>
    `${instancePath === '' ? 'manifest' : instancePath} ${message ?? 'is not allowed'}`;
}
