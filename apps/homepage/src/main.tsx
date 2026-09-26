/**
 * The standalone dev entry — the surface `nx run homepage:dev` serves.
 *
 * ⚠️ **The dynamic import is the point, not a style choice.** Module
 * Federation initialises its shared scope asynchronously; a static import of
 * the app graph here would evaluate React before the shared-module negotiation
 * finishes, which is the classic way to end up with two React instances. The
 * `bootstrap` split is what defers it.
 */
import './styles.css';

void import('./bootstrap.js');
