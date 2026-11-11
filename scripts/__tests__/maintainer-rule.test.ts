import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { maintainerRule } from '../lib/maintainer-rule.ts';

describe('maintainer rule', () => {
  const main = new Map([
    ['glass', { maintainers: ['jane-doe'] }],
    ['arcade', { maintainers: ['john-doe'] }],
    ['plain', {}],
  ]);
  const none = new Map();

  it('Approves an edit by the package maintainer, whatever the case of the login', () => {
    assert.equal(
      maintainerRule.approves('Jane-Doe', ['packages/glass/theme.css'], main, none),
      true,
    );
  });

  it('Approves a new package from someone who maintains another one and lists themselves', () => {
    const proposed = new Map([['frost', { maintainers: ['jane-doe'] }]]);

    assert.equal(
      maintainerRule.approves('jane-doe', ['packages/frost/manifest.json'], main, proposed),
      true,
    );
    assert.equal(
      maintainerRule.approves(
        'jane-doe',
        ['packages/frost/manifest.json'],
        main,
        new Map([['frost', {}]]),
      ),
      false,
    );
  });

  it('Refuses a stranger, a package with no maintainers and a first package', () => {
    assert.equal(
      maintainerRule.approves('john-doe', ['packages/glass/theme.css'], main, none),
      false,
    );
    assert.equal(
      maintainerRule.approves('jane-doe', ['packages/plain/manifest.json'], main, none),
      false,
    );
    const proposed = new Map([['first', { maintainers: ['bob-doe'] }]]);
    assert.equal(
      maintainerRule.approves('bob-doe', ['packages/first/manifest.json'], main, proposed),
      false,
    );
  });

  it('Judges a changed maintainers list by main, so nobody adds themselves', () => {
    assert.equal(
      maintainerRule.approves(
        'john-doe',
        ['packages/glass/manifest.json'],
        main,
        new Map([['glass', { maintainers: ['jane-doe', 'john-doe'] }]]),
      ),
      false,
    );
  });

  it('Refuses a file outside packages/ and an empty change', () => {
    assert.equal(
      maintainerRule.approves(
        'jane-doe',
        ['packages/glass/theme.css', 'scripts/check.ts'],
        main,
        none,
      ),
      false,
    );
    assert.equal(maintainerRule.approves('jane-doe', [], main, none), false);
  });
});
