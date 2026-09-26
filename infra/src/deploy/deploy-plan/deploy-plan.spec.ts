import { describe, expect, it } from 'vitest';

import { FULL_PLAN, isUnusableBase, parseRemote, planDeploy } from './deploy-plan.js';

describe('planDeploy', () => {
  it('deploys only the footer when only the footer is affected (verification 1)', () => {
    expect(planDeploy(['feature-footer', 'footer'])).toEqual({ remotes: ['footer'], shell: false });
  });

  it('deploys every app when the theme reaches every app (verification 2, R6)', () => {
    const themeChange = [
      'ui-theme',
      'header',
      'footer',
      'homepage',
      'portfolio-item',
      'shell',
      'e2e',
    ];

    expect(planDeploy(themeChange)).toEqual(FULL_PLAN);
  });

  it('deploys the shell for an infra change, because the Lambda is in the stack', () => {
    expect(planDeploy(['infra'])).toEqual({ remotes: [], shell: true });
  });

  it('deploys nothing for a library or e2e change that reaches no app', () => {
    expect(planDeploy(['shared-utils', 'e2e'])).toEqual({ remotes: [], shell: false });
  });

  it('keeps the remotes in a fixed order, whatever order Nx lists them in', () => {
    expect(planDeploy(['portfolio-item', 'header']).remotes).toEqual(['header', 'portfolio-item']);
  });
});

describe('isUnusableBase', () => {
  it.each([undefined, '', '0000000000000000000000000000000000000000'])(
    'treats %j as unusable',
    (base) => {
      expect(isUnusableBase(base)).toBe(true);
    }
  );

  it('accepts a real SHA', () => {
    expect(isUnusableBase('cd03959aabbccdd')).toBe(false);
  });
});

describe('parseRemote', () => {
  it('accepts a remote by its Nx name', () => {
    expect(parseRemote('portfolio-item')).toBe('portfolio-item');
  });

  it.each([undefined, 'shell', 'Footer'])('rejects %j, naming the valid remotes', (name) => {
    expect(() => parseRemote(name)).toThrow(
      'Expected one of: header, footer, homepage, portfolio-item'
    );
  });
});
