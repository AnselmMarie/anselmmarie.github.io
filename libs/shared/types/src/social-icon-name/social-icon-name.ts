/**
 * 🧭 **OWNER: the coordinator.**
 *
 * The outbound destinations the site links to, and therefore the set of brand
 * marks `@portfolio/ui-components`' `SocialIcon` can draw.
 *
 * ⚠️ **It lives in `shared-types`, not in `ui-components`, so there is exactly
 * one of it.** Two feature libs name these links — the footer and the homepage
 * hero — and the homepage's are fixture data. A copy of this union in the UI
 * package would mean the fixture and the component agreeing by luck rather than
 * by the compiler (D56's lesson about `cn`, applied to a type).
 *
 * `type:ui-components` may depend on `type:shared`, which is what makes this
 * placement legal; the reverse would not be (D29).
 */
export type SocialIconName = 'linkedin' | 'github';
