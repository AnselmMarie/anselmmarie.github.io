import type { Locator, Page } from '@playwright/test';

/**
 * Computed-style reads for the D38 / R3 assertions.
 *
 * ⚠️ **Tokens are resolved in the page, never hardcoded.** A spec that compared
 * against `rgb(20, 33, 30)` would break on every palette tweak and teach people
 * to update the number without looking. Resolving `var(--color-ink)` through a
 * probe element instead asks the real question: did this remote's Tailwind
 * class reach the page? Under R3 the theme's variables are still defined; it
 * is the *utility classes* that go missing, so the element falls back to the
 * browser default and stops matching the token.
 */

/** The computed value of a CSS custom property, normalised by the browser. */
export const resolveToken = (page: Page, property: 'color' | 'fontFamily', token: string) =>
  page.evaluate(
    ({ cssProperty, cssToken }) => {
      const probe = document.createElement('span');
      probe.style.setProperty(
        cssProperty === 'color' ? 'color' : 'font-family',
        `var(${cssToken})`
      );
      document.body.append(probe);
      const style = getComputedStyle(probe);
      const value = cssProperty === 'color' ? style.color : style.fontFamily;
      probe.remove();
      return value;
    },
    { cssProperty: property, cssToken: token }
  );

type StyleKey =
  | 'backgroundColor'
  | 'color'
  | 'display'
  | 'fontFamily'
  | 'fontSize'
  | 'gridTemplateColumns'
  | 'height'
  | 'letterSpacing'
  | 'lineHeight';

export const computed = (locator: Locator, key: StyleKey): Promise<string> =>
  locator.evaluate((element, styleKey) => getComputedStyle(element)[styleKey], key);

/**
 * WCAG contrast between an element's text colour and the background painted
 * behind it, alpha-blended the way the browser draws it.
 */
export const textContrast = (locator: Locator): Promise<number> =>
  locator.evaluate((element) => {
    const parse = (value: string): number[] => {
      const context = document.createElement('canvas').getContext('2d');
      if (!context) throw new Error('no 2d context');
      context.fillStyle = value;
      context.fillRect(0, 0, 1, 1);
      return [...context.getImageData(0, 0, 1, 1).data];
    };

    const paintedBackground = (node: Element | null): number[] => {
      for (let current = node; current; current = current.parentElement) {
        const rgba = parse(getComputedStyle(current).backgroundColor);
        if ((rgba[3] ?? 0) > 0) return rgba;
      }
      return [255, 255, 255, 255];
    };

    const background = paintedBackground(element);
    const [r = 0, g = 0, b = 0, a = 255] = parse(getComputedStyle(element).color);
    const alpha = a / 255;
    const text = [r, g, b].map(
      (channel, i) => channel * alpha + (background[i] ?? 0) * (1 - alpha)
    );

    const luminance = (rgb: number[]) => {
      const [lr = 0, lg = 0, lb = 0] = rgb.map((channel) => {
        const c = channel / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
    };

    const [lighter, darker] = [luminance(text), luminance(background)].sort((x, y) => y - x);
    return ((lighter ?? 0) + 0.05) / ((darker ?? 0) + 0.05);
  });
