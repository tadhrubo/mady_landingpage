import { FormEvent, RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import { ArrowUpRight, Check, ChevronDown, Clock3, MapPin, Phone, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { areas, ingredients, menuCategories, menuItems, navLinks, siteConfig } from './content/site';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

const logo = '/brand/mady-logo.png';

function Logo({ className = '' }: { className?: string }) {
  return <img src={logo} alt="Mady, beware you will go mad" className={className} data-testid="img-mady-logo" />;
}

function TextButton({ href, children, className = '', onClick }: { href?: string; children: string; className?: string; onClick?: () => void }) {
  const body = <span className={`pill-button ${className}`} onClick={onClick}><span>{children}</span><ArrowUpRight size={15} /></span>;
  return href ? <Link href={href} data-testid={`link-${children.toLowerCase().replaceAll(' ', '-')}`}>{body}</Link> : <button type="button" onClick={onClick} data-testid={`button-${children.toLowerCase().replaceAll(' ', '-')}`}>{body}</button>;
}

function useReveals() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    document.querySelectorAll('.reveal, .stagger').forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: false });
    const update = (time: number) => lenis.raf(time * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(update);
    };
  }, []);
}

function useBuildSequence(
  buildRef: RefObject<HTMLElement | null>,
  onProgress: (progress: number) => void,
) {
  useEffect(() => {
    const root = buildRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add(
        {
          desktop: '(min-width: 901px)',
          mobile: '(max-width: 900px)',
          reduced: '(prefers-reduced-motion: reduce)',
        },
        ({ conditions }) => {
          const stage = root.querySelector('.build-stage');
          const ingredientsOnStage = gsap.utils.toArray<HTMLElement>('.stage-ingredient');
          const finish = root.querySelector('.build-finish');
          const foldLeft = root.querySelector('.fold-left');
          const foldRight = root.querySelector('.fold-right');
          if (!stage || !finish || !foldLeft || !foldRight) return;

          if (conditions?.reduced) {
            gsap.set(ingredientsOnStage, { opacity: 1, y: 0, rotation: 0 });
            gsap.set([foldLeft, foldRight, finish], { opacity: 1, scaleX: 1, rotation: 0 });
            onProgress(100);
            return;
          }

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: 'top top',
              end: conditions?.desktop ? '+=4500' : '+=3000',
              pin: '.build-pin',
              scrub: 0.8,
              anticipatePin: 1,
              onUpdate: (trigger) => onProgress(trigger.progress * 100),
            },
          });

          gsap.set(ingredientsOnStage, { transformOrigin: '50% 50%' });
          timeline.fromTo(
            ingredientsOnStage[0],
            { opacity: 0, y: '-25vh', rotation: -10 },
            { opacity: 1, y: 0, rotation: -4, duration: 0.08, ease: 'power2.out' },
            0,
          );
          ingredientsOnStage.slice(1).forEach((ingredient, index) => {
            const direction = index % 2 === 0 ? 1 : -1;
            timeline.fromTo(
              ingredient,
              { opacity: 0, y: '-120vh', rotation: direction * 25 },
              {
                opacity: 1,
                y: 0,
                rotation: direction * 4,
                duration: 0.4,
                ease: 'power2.out',
              },
              0.08 + index * 0.065,
            );
          });
          timeline.to(foldLeft, { opacity: 1, scaleX: 1, rotation: 0, duration: 0.12 }, 0.58);
          timeline.to(foldRight, { opacity: 1, scaleX: 1, rotation: 0, duration: 0.12 }, 0.61);
          timeline.to(stage, { scaleY: 0.88, rotation: -4, duration: 0.14 }, 0.76);
          timeline.to(finish, { opacity: 1, duration: 0.08 }, 0.9);
          console.info('Mady ScrollTrigger count:', ScrollTrigger.getAll().length);
        },
      );
    }, root);

    return () => context.revert();
  }, [buildRef, onProgress]);
}

function WrapArt({ className = '' }: { className?: string }) {
  return <div className={`wrap-hero ${className}`} aria-label="Illustration of a finished wrapped shawarma" role="img">
    <div className="wrap-filling" /><div className="wrap-body"><div className="wrap-print">MADY<br />MADY<br />MADY</div></div><div className="wrap-tip" />
  </div>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', close);
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.removeEventListener('keydown', close); document.body.style.overflow = ''; };
  }, [open]);
  const go = (href: string) => { setOpen(false); navigate(href); };
  return <>
    <header className="site-header">
      <Link href="/" onClick={() => setOpen(false)} aria-label="Mady home"><Logo className="header-logo" /></Link>
      <div className="header-actions"><TextButton href="/menu">Shawarmas</TextButton><button type="button" className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} data-testid="button-menu-toggle">{open ? 'Close' : 'Menu'}</button></div>
    </header>
    <div className={`menu-overlay ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="overlay-top"><span className="eyebrow">Choose your chaos</span><button className="overlay-close" onClick={() => setOpen(false)} aria-label="Close navigation"><X size={19} /></button></div>
      <nav className="overlay-links" aria-label="Main navigation">
        {navLinks.map((link) => <button key={link.href} className="overlay-link display" onClick={() => go(link.href)} data-testid={`overlay-link-${link.label.toLowerCase().replaceAll(' ', '-')}`}>{link.label}</button>)}
      </nav>
       <div className="overlay-foot"><span className="serif">{siteConfig.tagline}</span><span className="eyebrow">{siteConfig.location}</span></div>
    </div>
  </>;
}

function PageTransition() {
  const [location] = useLocation();
  const [show, setShow] = useState(false);
  const previous = useRef(location);
  useEffect(() => {
    if (previous.current !== location) { setShow(true); const timer = window.setTimeout(() => setShow(false), 850); previous.current = location; return () => window.clearTimeout(timer); }
    return undefined;
  }, [location]);
  return <div className={`page-wipe ${show ? 'show' : ''}`} aria-hidden="true" />;
}

function Preloader() {
  const [done, setDone] = useState(false); const [count, setCount] = useState(0);
  useEffect(() => {
    try { if (sessionStorage.getItem('mady-loaded')) { setDone(true); return; } sessionStorage.setItem('mady-loaded', '1'); } catch { /* private browsing */ }
    const started = Date.now(); const timer = window.setInterval(() => setCount(Math.min(100, Math.round(((Date.now() - started) / 1400) * 100))), 30);
    const finish = window.setTimeout(() => { setCount(100); setDone(true); }, 1450);
    return () => { window.clearInterval(timer); window.clearTimeout(finish); };
  }, []);
  if (done) return null;
  return <div className="preloader" role="status"><div className="preload-inner"><Logo className="preload-logo" /><div className="preload-copy">Preparing the madness...</div><div className="preload-number">{count}</div></div></div>;
}

function Marquee({ children, className = '' }: { children: string; className?: string }) {
  return <div className={`marquee ${className}`} aria-hidden="true"><span className="marquee-track">{`${children}   ${children}   ${children}   ${children}   `}</span></div>;
}

function Footer() {
  return <footer className="footer">
    <div className="footer-top"><div className="footer-links">{navLinks.map((link) => <Link key={link.href} href={link.href} data-testid={`footer-link-${link.label.toLowerCase().replaceAll(' ', '-')}`}>{link.label}</Link>)}</div><span className="serif">{siteConfig.tagline}</span></div>
    <div className="footer-word display">Mady</div>
    <div className="footer-bottom"><span>© 2026 Mady Shawarma</span><span>Made for hungry people in a hurry</span></div>
  </footer>;
}

function Home() {
  useReveals();
  const [progress, setProgress] = useState(0);
  const buildRef = useRef<HTMLElement>(null);
  const updateProgress = useRef((value: number) => setProgress(value)).current;
  useBuildSequence(buildRef, updateProgress);
  const landed = Math.floor(progress / 12.5);
  return <main>
    <section className="hero">
      <div className="hero-kicker reveal"><span>SHAWARMA / 01</span><span>CHITTAGONG</span></div>
      <h1 className="hero-title display outline-text reveal"><span>THE</span><span>SHAWARMA</span></h1>
      <div className="hero-side left">ROLLED / TIGHT</div><div className="hero-side right">MAD / GARLIC</div><div className="hero-badge" />
      <WrapArt />
      <div className="hero-copy reveal"><p>Wrapped hot, rolled tight, loaded with garlic. Proceed at your own risk.</p><TextButton href="/menu">Order now</TextButton></div>
      <div className="scroll-hint">KEEP SCROLLING<i /></div>
    </section>
    <section className="section red">
      <div className="story-intro reveal"><div><span className="eyebrow">Not a phase</span><h2 className="section-title display">Hot. Garlicky. Fully loaded.</h2><p className="section-lede">A little spit, a lot of attitude. Mady is the kind of wrap that leaves the paper guilty and your hands very busy.</p></div><div className="story-stamp">100% HANDS ON<br /><span className="serif">zero boring bites</span></div></div>
      <div className="collage stagger">
        <figure className="collage-card"><svg className="flat-art" viewBox="0 0 400 300" aria-label="Abstract shawarma spit illustration"><rect width="400" height="300" fill="#FFD21F" /><rect x="190" y="30" width="28" height="235" fill="#1A0B0B" /><path d="M145 65 Q230 30 285 75 L275 213 Q220 250 155 212Z" fill="#9B1B20" stroke="#1A0B0B" strokeWidth="7"/><path d="M165 105 Q230 75 268 104 M165 142 Q230 112 268 142 M166 180 Q230 150 266 178" fill="none" stroke="#E41B23" strokeWidth="18"/></svg><figcaption>the spit does the talking</figcaption></figure>
        <figure className="collage-card"><svg className="flat-art" viewBox="0 0 300 300" aria-label="Abstract wrapping hands illustration"><rect width="300" height="300" fill="#fff"/><path d="M45 240 Q62 155 145 148 Q225 142 259 238" fill="#FFD21F" stroke="#1A0B0B" strokeWidth="7"/><path d="M65 190 Q100 105 141 97 Q177 91 176 124 L138 188 M229 190 Q205 95 165 102 Q147 105 158 136 L183 191" fill="#E41B23" stroke="#1A0B0B" strokeWidth="7"/><ellipse cx="148" cy="201" rx="75" ry="24" fill="#fff" stroke="#1A0B0B" strokeWidth="7"/></svg><figcaption>fold with feeling</figcaption></figure>
        <figure className="collage-card"><svg className="flat-art" viewBox="0 0 330 300" aria-label="Sliced shawarma illustration"><rect width="330" height="300" fill="#9B1B20"/><ellipse cx="164" cy="150" rx="115" ry="100" fill="#fff" stroke="#1A0B0B" strokeWidth="7"/><path d="M73 145 Q164 65 257 148 Q164 192 73 145" fill="#E41B23" stroke="#1A0B0B" strokeWidth="7"/><circle cx="133" cy="138" r="12" fill="#FFD21F"/><circle cx="182" cy="119" r="11" fill="#9fb324"/><circle cx="196" cy="158" r="12" fill="#FFD21F"/></svg><figcaption>cut open the madness</figcaption></figure>
      </div>
    </section>
    <Marquee className="section red" children="MAD ABOUT SHAWARMA" />
    <section className="section chips-section">
      <div className="chips-layout"><div className="chip-stack stagger">{['HAND WRAPPED', 'EXTRA GARLIC', 'HOT OFF THE SPIT'].map((x) => <div className="chip" key={x}>{x}</div>)}</div><div className="center-wrap"><WrapArt /></div><div className="chip-stack stagger">{['NO SHORTCUTS', 'TRUE TASTE', 'WORTH THE MESS'].map((x) => <div className="chip" key={x}>{x}</div>)}</div></div>
    </section>
    <section className="build-section" id="build" ref={buildRef}>
      <div className="build-pin">
        <div className="build-copy"><span className="eyebrow">Signature scroll sequence</span><h2 className="display">{['EVERY', 'LAYER', 'PACKED', 'WITH', 'MADNESS'].map((word, i) => <span className={`build-word ${landed > i ? 'active' : ''}`} key={word}>{word}</span>)}</h2></div>
        <div className={`build-stage ${progress > 58 ? 'folding' : ''}`}><div className="stage-label">BUILD THE WRAP / {Math.round(progress)}%</div><div className={`stage-ingredient flatbread landed`} /><div className={`stage-ingredient sauce ${landed > 1 ? 'landed' : ''}`} /><div className={`stage-ingredient chicken ${landed > 2 ? 'landed' : ''}`} /><div className={`stage-ingredient pickles ${landed > 3 ? 'landed' : ''}`} /><div className={`stage-ingredient tomato ${landed > 4 ? 'landed' : ''}`} /><div className={`stage-ingredient lettuce ${landed > 5 ? 'landed' : ''}`} /><div className={`stage-ingredient fries ${landed > 6 ? 'landed' : ''}`} /><div className={`stage-ingredient red-sauce ${landed > 7 ? 'landed' : ''}`} /><div className="fold-flap fold-left" /><div className="fold-flap fold-right" /><div className="stage-plate" /><div className={`build-finish ${progress > 90 ? 'visible' : ''}`}>Now try not to go mad.</div><div className="stage-caption">scroll it into existence</div></div>
        <div className="build-dots">{ingredients.map((ingredient, i) => <span key={ingredient.id} className={`build-dot ${landed > i ? 'active' : ''}`} title={ingredient.label} />)}</div>
      </div>
    </section>
    <section className="section paper">
      <div className="takeaway-grid reveal"><div><span className="eyebrow">Take away</span><h2 className="section-title display">Wrapped to go</h2><p className="section-lede">The city is moving. So are we. Find the red sign, follow the smell, leave with something warm.</p></div><div className="serif" style={{fontSize:'clamp(2rem,4vw,4rem)'}}>Wherever hungry takes you.</div></div>
       <div className="area-track stagger">{areas.map((area, i) => <article className="area-card" key={area.name}><div className="area-art"><img src={area.image} alt="" />0{i + 1}</div><h3 className="display">{area.name}</h3><p>Open late. Leave happy.</p></article>)}</div>
    </section>
    <section className="section cta red"><span className="eyebrow">Feel it</span><h2 className="section-title display">Go a little mad.</h2><p className="section-lede" style={{margin:'0 auto 25px'}}>You already made it this far. That is basically an order.</p><TextButton href="/menu" className="white-line">Order now</TextButton><div className="cta-art"><WrapArt /></div></section>
    <Footer />
  </main>;
}

function Inside() {
  useReveals();
  return <main><section className="page-hero"><span className="eyebrow">What's inside</span><h1 className="display outline-text reveal">Simple things done right.</h1><p className="section-lede reveal">A short list. We are obsessive about every item on it.</p></section>
    <section className="section inside-path"><svg className="curve" viewBox="0 0 600 800" fill="none" aria-hidden="true"><path d="M250 0 C50 150 510 230 275 400 C40 570 540 625 320 800" stroke="#E41B23" strokeWidth="8" strokeDasharray="14 16"/></svg><div className="path-dot">BREAD</div><div className="path-dot">SAUCE</div><div className="path-dot">HEAT</div><div className="path-dot">CRUNCH</div><div className="inside-copy reveal"><span className="eyebrow">From the spit to your hands</span><h2 className="display">A wrap is a small architecture.</h2><p className="section-lede">We thought about where each layer comes from and what it brings to the wrap. Then we put it together and made it impossible to eat politely.</p><TextButton href="/menu">Meet the menu</TextButton></div></section>
    <section className="section ingredient-cards"><span className="eyebrow">A story in every bite</span><h2 className="display">Nothing random. Everything delicious.</h2><div className="stack-cards">{ingredients.slice(0,6).map((item, i) => <article className="ingredient-card reveal" key={item.id}><span className="card-number">0{i + 1}</span><h3 className="display">{item.label}</h3><p>{item.desc}</p></article>)}</div></section>
    <section className="section cta"><span className="eyebrow">Feel it</span><h2 className="section-title display">Go a little mad.</h2><p className="section-lede" style={{margin:'0 auto 25px'}}>The best stories end with garlic on your fingers.</p><TextButton href="/menu">Order now</TextButton></section><Footer /></main>;
}

function Menu() {
  useReveals(); const [active, setActive] = useState(menuCategories[0]);
  const items = useMemo(() => menuItems.filter((item) => item.category === active), [active]);
  return <main><section className="section menu-hero"><div><span className="eyebrow">No small bites</span><h1 className="display outline-text reveal">Eat till you go mad.</h1></div><div className="menu-count"><span>{items.length.toString().padStart(2,'0')}</span><br /><small className="eyebrow">things to want</small></div></section>
     <section className="section menu-shell"><div className="menu-tabs" role="tablist">{menuCategories.map((category) => <button key={category} className={`tab ${active === category ? 'active' : ''}`} onClick={() => setActive(category)} role="tab" aria-selected={active === category} data-testid={`tab-${category.toLowerCase().replaceAll(' ', '-')}`}>{category}</button>)}</div><div className="menu-grid stagger in">{items.map((item) => <article className="menu-card" key={item.name}><div className="menu-art"><WrapArt /></div><div><h3 className="display">{item.name}</h3><div className="menu-card-meta"><span className="price">{siteConfig.currency}{item.price}</span><span className="ask-link">{item.note ?? 'Ask on WhatsApp'}</span></div></div></article>)}</div></section><section className="section red cta"><h2 className="section-title display">One more?</h2><TextButton href="/contact" className="white-line">Find us</TextButton></section><Footer /></main>;
}

function Contact() {
  useReveals(); const [errors, setErrors] = useState<{name?: string; message?: string}>({}); const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data = new FormData(event.currentTarget); const name = String(data.get('name') ?? '').trim(); const message = String(data.get('message') ?? '').trim(); const next: typeof errors = {}; if (!name) next.name = 'Tell us your name first.'; if (message.length < 10) next.message = 'Give us at least a little something.'; setErrors(next); if (!Object.keys(next).length) { console.info('Mady contact payload', Object.fromEntries(data.entries())); setSent(true); event.currentTarget.reset(); } };
   return <main><section className="section contact-grid" style={{paddingTop:'150px'}}><div className="contact-info"><span className="eyebrow">Come say hi</span><h1 className="display outline-text reveal">Let's get mad.</h1><p className="section-lede">Questions, cravings, birthday plans, strong shawarma opinions. We are listening.</p><div className="contact-detail"><span><MapPin size={16} /></span><div>{siteConfig.contact.address[0]}<br />{siteConfig.contact.address[1]}</div></div><div className="contact-detail"><span><Phone size={16} /></span><div>{siteConfig.contact.phone}</div></div><div className="contact-detail"><span><Clock3 size={16} /></span><div>{siteConfig.contact.hours[0]}<br />{siteConfig.contact.hours[1]}</div></div><a href={siteConfig.contact.whatsapp} className="pill-button" data-testid="link-whatsapp">Ask on WhatsApp <ArrowUpRight size={15} /></a></div><form className="contact-form" onSubmit={submit} noValidate><span className="eyebrow">Leave a note</span><div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" placeholder="The hungry one" data-testid="input-name" aria-invalid={!!errors.name} />{errors.name && <span className="field-error">{errors.name}</span>}</div><div className="field"><label htmlFor="message">What's on your mind?</label><textarea id="message" name="message" placeholder="Tell us everything..." data-testid="input-message" aria-invalid={!!errors.message} />{errors.message && <span className="field-error">{errors.message}</span>}</div><button className="pill-button" type="submit" data-testid="button-send-message">Send it <ArrowUpRight size={15} /></button>{sent && <div className="form-success" role="status"><Check size={16} /> Message received. We will get back to you.</div>}</form></section><section className="section" style={{paddingTop:0}}><div className="map-block"><div className="map-pin"><span>M</span></div><span className="eyebrow" style={{position:'absolute',bottom:20}}>You are here, probably hungry</span></div></section><Footer /></main>;
}

function NotFound() { return <main className="page-hero"><span className="eyebrow">Wrong turn</span><h1 className="display outline-text">This page went mad.</h1><TextButton href="/">Back home</TextButton></main>; }

function Router() {
  return <><Header /><PageTransition /><Switch><Route path="/" component={Home} /><Route path="/inside" component={Inside} /><Route path="/menu" component={Menu} /><Route path="/contact" component={Contact} /><Route component={NotFound} /></Switch></>;
}

export default function App() {
  useSmoothScroll();
  return <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Preloader /><Router /></WouterRouter>;
}