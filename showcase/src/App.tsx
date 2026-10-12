import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { BRAND, whatsappUrl } from './brand';
import { STATIONS } from './stations';
import { world } from './store';

// three.js is large, so the world loads after the first paint of the text.
const Scene = lazy(() => import('./Scene').then((m) => ({ default: m.Scene })));

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

const BAGS_PER_TONNE = 1000 / 26;
const CONTAINER_TONNES = 26;

// Light scenes need dark type, dark scenes need light type. Matches the sky in stations.ts.
const TONE = ['dark', 'light', 'dark', 'dark', 'light', 'dark'] as const;

const orderMessage = (tonnes?: number) =>
  tonnes
    ? `Hi LG Gold, I would like a quote for about ${tonnes} MT (${Math.round(tonnes * BAGS_PER_TONNE)} bags of 26 kg) of ${BRAND.product}. Please share the rate, packing and dispatch timeline.`
    : `Hi LG Gold, I saw the ${BRAND.product} 26 kg bag on your website. Please share the rate and availability for my quantity.`;

const SPECS: [string, string][] = [
  ['Variety', 'JSR Lachkari Kolam'],
  ['Grain length', '4.8 to 5.2 mm'],
  ['Ageing', '12 months or more'],
  ['Moisture', 'Under 12.8%'],
  ['Broken grains', 'Under 1.8%'],
  ['Sorting', '100% Sortex optical'],
  ['Pack', '26 kg heavy-duty woven bag'],
  ['Best before', '24 months from packing'],
];

export const App = () => {
  const webgl = useMemo(hasWebGL, []);
  const [tonnes, setTonnes] = useState(CONTAINER_TONNES);
  const [active, setActive] = useState(0);

  useEffect(() => {
    world.tonnes = tonnes;
  }, [tonnes]);

  useEffect(() => {
    const onScroll = () => {
      const steps = document.querySelectorAll<HTMLElement>('[data-step]');
      const mid = window.scrollY + window.innerHeight / 2;
      let idx = -1;
      steps.forEach((el, i) => {
        if (mid >= el.offsetTop && mid < el.offsetTop + el.offsetHeight) idx = i;
      });
      setActive(idx);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (i: number) => {
    const el = document.querySelectorAll<HTMLElement>('[data-step]')[i];
    if (el) window.scrollTo({ top: el.offsetTop, behavior: 'auto' });
  };

  const bags = Math.round(tonnes * BAGS_PER_TONNE);
  const fillPct = Math.round((tonnes / CONTAINER_TONNES) * 100);
  const tone = active >= 0 ? TONE[active] : 'dark';

  return (
    <>
      <div className="stage" aria-hidden={webgl}>
        {webgl ? (
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        ) : (
          <img
            className="stage-fallback"
            src={`${import.meta.env.BASE_URL}textures/bag-flat.jpg`}
            alt="LG Gold JSR Lachkari Kolam Rice 26 kg bag"
          />
        )}
      </div>

      <header className={`nav nav-${tone}`}>
        <div className="nav-inner">
          <a className="wordmark" href="#top">LG Gold</a>
          <nav aria-label="Journey stages" className="nav-links">
            {STATIONS.map((s, i) => (
              <button key={s.id} onClick={() => goTo(i)} aria-current={i === active ? 'step' : undefined}>
                {s.label}
              </button>
            ))}
          </nav>
          <a className="pill pill-small" href={whatsappUrl(orderMessage())} target="_blank" rel="noopener noreferrer">
            Order
          </a>
        </div>
      </header>

      <main id="top">
        {/* 0 */}
        <section className={`step tone-${TONE[0]}`} data-step>
          <div className={`copy ${active === 0 ? 'in' : ''}`}>
            <p className="kicker">{BRAND.product}</p>
            <h1>LG Gold.</h1>
            <p className="sub">Silky, Sortex-clean rice, grown in Telangana and packed at the mill.</p>
            <div className="actions">
              <a className="pill" href={whatsappUrl(orderMessage())} target="_blank" rel="noopener noreferrer">
                Order on WhatsApp
              </a>
              <button className="link" onClick={() => goTo(1)}>Follow the grain</button>
            </div>
          </div>
        </section>

        {/* 1 */}
        <section className={`step tone-${TONE[1]}`} data-step>
          <div className={`copy ${active === 1 ? 'in' : ''}`}>
            <h2>Slender by nature.</h2>
            <p className="sub">
              4.8 to 5.2 mm long. Aged for 12 months or more, so every grain cooks up separate, light and aromatic.
            </p>
            {webgl && <p className="hint">Drag to turn the grain.</p>}
          </div>
        </section>

        {/* 2 */}
        <section className={`step tone-${TONE[2]}`} data-step>
          <div className={`copy ${active === 2 ? 'in' : ''}`}>
            <h2>Every grain, inspected.</h2>
            <p className="sub">
              Optical Sortex cameras scan the rice as it moves. A puff of air removes discoloured and broken grains, and
              only the clean grain goes on.
            </p>
          </div>
        </section>

        {/* 3 */}
        <section className={`step tone-${TONE[3]}`} data-step>
          <div className={`copy ${active === 3 ? 'in' : ''}`}>
            <h2>Sealed at 26 kg.</h2>
            <p className="sub">
              Weighed into heavy-duty woven bags and stitched shut. Each bag carries the grade, the batch and the mill
              address.
            </p>
            {webgl && <p className="hint">Drag to see the print.</p>}
          </div>
        </section>

        {/* 4 */}
        <section className={`step tone-${TONE[4]}`} data-step>
          <div className={`copy ${active === 4 ? 'in' : ''}`}>
            <h2>Loaded to your order.</h2>
            <p className="sub">Slide to the quantity you plan to buy and watch the container fill.</p>
            <label className="slider" htmlFor="tonnes">
              <span className="sr-only">Quantity in metric tonnes</span>
              <input
                id="tonnes"
                type="range"
                min={1}
                max={CONTAINER_TONNES}
                step={1}
                value={tonnes}
                onChange={(e) => setTonnes(Number(e.target.value))}
              />
            </label>
            <dl className="readout" aria-live="polite">
              <div>
                <dt>Quantity</dt>
                <dd>{tonnes} MT</dd>
              </div>
              <div>
                <dt>26 kg bags</dt>
                <dd>{bags.toLocaleString('en-IN')}</dd>
              </div>
              <div>
                <dt>20ft container</dt>
                <dd>{fillPct}% full</dd>
              </div>
            </dl>
            <a className="pill" href={whatsappUrl(orderMessage(tonnes))} target="_blank" rel="noopener noreferrer">
              Ask for this quantity
            </a>
          </div>
        </section>

        {/* 5 */}
        <section className={`step tone-${TONE[5]}`} id="order" data-step>
          <div className={`copy ${active === 5 ? 'in' : ''}`}>
            <h2>Ready for your port.</h2>
            <p className="sub">
              Containers leave the mill dock sealed and documented for FOB or CIF shipping. Retail bags and wholesale
              lots from 500 kg too.
            </p>
            <div className="actions">
              <a className="pill" href={whatsappUrl(orderMessage())} target="_blank" rel="noopener noreferrer">
                Message the mill
              </a>
              <a className="link" href={`tel:+${BRAND.phoneDigits}`}>Call {BRAND.phoneDisplay}</a>
            </div>
          </div>
        </section>

        {/* Plain content from here on: opaque, so it covers the 3D stage */}
        <section className="specs">
          <h2>At a glance.</h2>
          <dl>
            {SPECS.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <footer className="footer">
          <div className="footer-inner">
            <div>
              <p className="footer-brand">{BRAND.company}</p>
              <p>{BRAND.address}</p>
              <p>{BRAND.hours}</p>
            </div>
            <div>
              <p>
                <a href={`tel:+${BRAND.phoneDigits}`}>{BRAND.phoneDisplay}</a>
              </p>
              <p>
                <a href={`mailto:${BRAND.emailWholesale}`}>{BRAND.emailWholesale}</a>
              </p>
              <p>
                <a href={BRAND.mainSite}>Full LG Gold website</a>
              </p>
            </div>
          </div>
          <p className="legal">LG Gold is a brand of {BRAND.company}.</p>
        </footer>
      </main>
    </>
  );
};
