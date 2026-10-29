export class VersionBump {
  problem(id: string, before: string | null, after: string): string | null {
    if (before === null || this.#newer(after, before)) return null;

    return `${id} changed, so its version must go above ${before} (it is ${after}).`;
  }

  #newer(after: string, before: string): boolean {
    const [a, b] = [after, before].map((version) => version.split('.').map(Number));
    const index = a.findIndex((part, at) => part !== b[at]);

    return index >= 0 && a[index] > b[index];
  }
}

export const versionBump = new VersionBump();
