export class ThemeChanges {
  of(paths: string[]): string[] {
    const themes = paths
      .map((file) => file.split('/'))
      .filter(([root, id, kind, theme]) => root === 'packages' && id && kind === 'themes' && theme)
      .map(([, id, , theme]) => `${id}/${theme}`);

    return [...new Set(themes)];
  }
}

export const themeChanges = new ThemeChanges();
