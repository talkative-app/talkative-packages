export interface Maintained {
  maintainers?: string[];
}

export class MaintainerRule {
  approves(
    author: string,
    files: string[],
    main: Map<string, Maintained>,
    proposed: Map<string, Maintained>,
  ): boolean {
    if (files.length === 0 || !files.every((file) => /^packages\/[^/]+\/./.test(file)))
      return false;

    const ids = new Set(files.map((file) => file.split('/')[1] ?? ''));

    return [...ids].every((id) => {
      const current = main.get(id);
      if (current !== undefined) return this.#lists(current, author);

      const added = proposed.get(id);
      return added !== undefined && this.#lists(added, author) && this.#maintainsAny(main, author);
    });
  }

  #maintainsAny(main: Map<string, Maintained>, author: string): boolean {
    return [...main.values()].some((manifest) => this.#lists(manifest, author));
  }

  #lists(manifest: Maintained, author: string): boolean {
    const login = author.toLowerCase();

    return (manifest.maintainers ?? []).some((each) => each.toLowerCase() === login);
  }
}

export const maintainerRule = new MaintainerRule();
