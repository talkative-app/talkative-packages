import { EXAMPLE_PACKAGE } from './catalog-builder.ts';

const TOOLING = ['.github/', 'schema/', 'scripts/', 'package.json', 'package-lock.json'];

export class PullRequestScope {
  packageOf(changed: string[]): string | null {
    return this.#packages(changed)[0] ?? null;
  }

  problems(changed: string[]): string[] {
    const packages = this.#packages(changed);
    if (packages.length === 0) return [];
    if (packages.length > 1) {
      return [`One pull request changes one package; this one changes ${packages.join(', ')}.`];
    }

    return changed
      .filter((file) => !file.startsWith(`packages/${packages[0]}/`))
      .map(
        (file) =>
          `${file} is outside packages/${packages[0]}/; a package pull request changes only its package.`,
      );
  }

  #packages(changed: string[]): string[] {
    if (changed.some((file) => TOOLING.some((prefix) => file.startsWith(prefix)))) return [];

    const ids = changed
      .filter((file) => file.startsWith('packages/') && file.split('/').length > 2)
      .map((file) => file.split('/')[1] ?? '')
      .filter((id) => id !== EXAMPLE_PACKAGE);

    return [...new Set(ids)].sort();
  }
}

export const pullRequestScope = new PullRequestScope();
