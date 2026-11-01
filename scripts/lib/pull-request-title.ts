export type PackageChange = { id: string; before: string | null; after: string };

const TITLE = /^(feat|fix|docs|chore|ci|refactor|test): \S/;

export class PullRequestTitle {
  problem(title: string, change: PackageChange | null): string | null {
    if (change === null) {
      return TITLE.test(title)
        ? null
        : `The title "${title}" needs a type: feat, fix, docs, chore, ci, refactor or test, then ": ".`;
    }

    const expected = `${this.#type(change)}: ${change.id} ${change.after}`;

    return title === expected
      ? null
      : `The title is "${title}"; this pull request is "${expected}".`;
  }

  #type({ before, after }: PackageChange): 'feat' | 'fix' {
    if (before === null) return 'feat';

    const [major, minor] = before.split('.');
    const [nextMajor, nextMinor] = after.split('.');

    return major === nextMajor && minor === nextMinor ? 'fix' : 'feat';
  }
}

export const pullRequestTitle = new PullRequestTitle();
