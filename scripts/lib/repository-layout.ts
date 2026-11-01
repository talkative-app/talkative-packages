const ROOT_ENTRIES = new Set([
  '.github',
  '.gitignore',
  '.prettierrc.json',
  'CONTRIBUTING.md',
  'GUIDE.md',
  'README.md',
  'package-lock.json',
  'package.json',
  'packages',
  'schema',
  'scripts',
]);

export class RepositoryLayout {
  problems(tracked: string[]): string[] {
    return tracked
      .filter((file) => {
        const parts = file.split('/');

        return !ROOT_ENTRIES.has(parts[0] ?? '') || (parts[0] === 'packages' && parts.length === 2);
      })
      .map((file) => `${file} sits outside a package folder; a package lives in packages/<id>/.`);
  }
}

export const repositoryLayout = new RepositoryLayout();
