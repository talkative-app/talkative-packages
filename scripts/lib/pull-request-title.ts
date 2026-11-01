export type PackageChange = { id: string; before: string | null; after: string };

const TITLE = /^(feat|fix|docs|chore|ci|refactor|test): \S/;

export class PullRequestTitle {
  problem(title: string, change: PackageChange | null): string | null {
    if (change === null) {
      return TITLE.test(title)
        ? null
        : `The title "${title}" needs a type: feat, fix, docs, chore, ci, refactor or test, then ": ".`;
    }

    const kind = change.before === null ? 'add-package' : 'update-package';
    const expected = `${kind}: ${change.id} ${change.after}`;

    return title === expected
      ? null
      : `The title is "${title}"; this pull request is "${expected}".`;
  }
}

export const pullRequestTitle = new PullRequestTitle();
