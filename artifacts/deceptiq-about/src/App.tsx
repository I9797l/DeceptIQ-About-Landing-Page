import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react';
import {
  Activity,
  ArrowDown,
  ArrowUpRight,
  BrainCircuit,
  Crosshair,
  Eye,
  FileCheck2,
  LockKeyhole,
  Radar,
  ShieldCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Link, Route, Router as WouterRouter, Switch, useLocation } from 'wouter';

const queryClient = new QueryClient();
export const PORTAL_URL = '/dashboard';

type StoryPart = {
  number: string;
  short: string;
  title: ReactNode;
  copy: string;
  icon: LucideIcon;
  signal: string;
  layer: string;
  accent?: 'magenta';
  card: { label: string; value: string }[];
};

const storyParts: StoryPart[] = [
  {
    number: '02',
    short: 'Deception',
    title: <>Adaptive <em>Deception</em></>,
    copy: 'Engage attacker behavior inside believable controlled environments while keeping the real system outside the interaction.',
    icon: Radar,
    signal: 'DECEPTION / ADAPTING',
    layer: 'deception surface',
    card: [
      { label: 'environment', value: 'controlled' },
      { label: 'interaction', value: 'believable' },
      { label: 'real system', value: 'outside' },
    ],
  },
  {
    number: '03',
    short: 'Replay',
    title: <>Every interaction becomes a <em>story.</em></>,
    copy: 'DeceptIQ reconstructs attacker activity into sessions, timelines, flows and evidence-backed investigation views.',
    icon: Eye,
    signal: 'SESSION / REPLAYING',
    layer: 'observation paths',
    card: [
      { label: 'traffic', value: 'captured' },
      { label: 'session', value: 'reconstructed' },
      { label: 'evidence', value: 'linked' },
    ],
  },
  {
    number: '04',
    short: 'ATT&CK',
    title: <>Mapped to real adversary <em>behavior.</em></>,
    copy: 'Observed actions are deterministically classified and mapped to pinned MITRE ATT&CK techniques.',
    icon: Crosshair,
    signal: 'ATT&CK / MAPPED',
    layer: 'technique cells',
    card: [
      { label: 'classification', value: 'deterministic' },
      { label: 'framework', value: 'MITRE ATT&CK' },
      { label: 'authority', value: 'pinned' },
    ],
  },
  {
    number: '05',
    short: 'D3FEND',
    title: <>From observation to defensive <em>clarity.</em></>,
    copy: 'Verified ATT&CK evidence is connected to official D3FEND knowledge and locally supported defensive guidance.',
    icon: Activity,
    signal: 'D3FEND / GUIDANCE',
    layer: 'defensive ring',
    card: [
      { label: 'knowledge', value: 'official D3FEND' },
      { label: 'guidance', value: 'locally supported' },
      { label: 'decision', value: 'operator-led' },
    ],
  },
  {
    number: '06',
    short: 'Callbacks',
    title: <>Evidence that <em>calls back.</em></>,
    copy: 'Honeytokens preserve their origin, planted identity and callback provenance so an interaction can be traced to the session that created it.',
    icon: Radar,
    signal: 'HONEYTOKEN / VERIFIED CALLBACK',
    layer: 'token nodes',
    accent: 'magenta',
    card: [
      { label: 'origin', value: 'preserved' },
      { label: 'identity', value: 'planted' },
      { label: 'provenance', value: 'traceable' },
    ],
  },
  {
    number: '07',
    short: 'Evidence',
    title: <>Evidence designed to be <em>verified.</em></>,
    copy: 'Append-only event records and hash-chain verification make unexpected changes visible.',
    icon: FileCheck2,
    signal: 'EVIDENCE / HASH-CHAIN INTACT',
    layer: 'evidence rings',
    card: [
      { label: 'records', value: 'append-only' },
      { label: 'integrity', value: 'hash-chain' },
      { label: 'unexpected change', value: 'visible' },
    ],
  },
  {
    number: '08',
    short: 'Qwen',
    title: <>AI grounded in recorded <em>evidence.</em></>,
    copy: 'Qwen produces system-wide security summaries and detailed investigations grounded in stored sessions, citations and deterministic classifications.',
    icon: BrainCircuit,
    signal: 'QWEN / GROUNDED',
    layer: 'analysis layer',
    card: [
      { label: 'summaries', value: 'evidence-grounded' },
      { label: 'authority', value: 'deterministic logic' },
      { label: 'defensive control', value: 'not autonomous' },
    ],
  },
  {
    number: '09',
    short: 'Command',
    title: <>One command center. Complete <em>visibility.</em></>,
    copy: 'Sessions, traffic, alerts, honeytokens, ATT&CK coverage, defensive guidance, evidence integrity and AI analysis in one operator experience.',
    icon: LockKeyhole,
    signal: 'COMMAND CENTER / REASSEMBLED',
    layer: 'operator experience',
    card: [
      { label: 'sessions', value: 'connected' },
      { label: 'coverage', value: 'mapped' },
      { label: 'visibility', value: 'complete' },
    ],
  },
];

function Logo() {
  return (
    <Link href="/" className="wordmark" data-testid="link-home">
      <img className="wordmark-logo" src={`${import.meta.env.BASE_URL}deceptiq-logo.png`} alt="" aria-hidden="true" />
      <span>DeceptIQ</span>
    </Link>
  );
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return progress;
}

function LayeredCore({ progress, activePart = 0, compact = false }: { progress: number; activePart?: number; compact?: boolean }) {
  const spread = Math.sin(Math.PI * Math.min(1, Math.max(0, progress))) * (compact ? 0.78 : 1);
  const rotation = progress * 260;
  const coreStyle = {
    '--spread': spread.toFixed(3),
    '--rotation': `${rotation.toFixed(2)}deg`,
    '--active-layer': activePart,
    '--signal-progress': (0.15 + progress * 0.7).toFixed(3),
    '--signal-x': `${18 + (0.15 + progress * 0.7) * 64}%`,
  } as CSSProperties;

  return (
    <div
      className={`layered-core${compact ? ' layered-core-compact' : ''}`}
      style={coreStyle}
      aria-label="Animated layered DeceptIQ Cyber Defense Core"
      data-testid="layered-defense-core"
    >
      <div className="core-halo" aria-hidden="true" />
      <div className="core-grid" aria-hidden="true" />
      <div className="core-orbit core-orbit-one" aria-hidden="true" />
      <div className="core-orbit core-orbit-two" aria-hidden="true" />
      <div className="core-ring ring-evidence" aria-hidden="true"><span>HASH</span></div>
      <div className="core-ring ring-attack" aria-hidden="true"><span>ATT&amp;CK</span></div>
      <div className="core-layer layer-surface" aria-hidden="true"><span>DECEPTION</span></div>
      <div className="core-layer layer-techniques" aria-hidden="true"><span>TECHNIQUE CELLS</span></div>
      <div className="core-layer layer-tokens" aria-hidden="true"><span>HONEYTOKENS</span></div>
      <div className="core-layer layer-ai" aria-hidden="true">
        <BrainCircuit size={22} strokeWidth={1.2} />
        <span>QWEN / GROUNDED</span>
      </div>
      <div className="core-energy" aria-hidden="true" />
      <div className="core-signal" aria-hidden="true"><span>HOSTILE SIGNAL</span></div>
      <div className="core-node core-node-a" aria-hidden="true"><Eye size={15} /></div>
      <div className="core-node core-node-b" aria-hidden="true"><FileCheck2 size={15} /></div>
      <div className="core-node core-node-c" aria-hidden="true"><Radar size={15} /></div>
      <div className="core-center-label"><strong>DEFENSE<br />CORE</strong><span>{activePart > 6 ? 'reassembled / live' : 'layers / separating'}</span></div>
      <div className="core-readout"><i>●</i> signal path <b>{String(Math.min(10, activePart + 2)).padStart(2, '0')} / 10</b></div>
    </div>
  );
}

function StoryVisual({ part, index, progress }: { part: StoryPart; index: number; progress: number }) {
  return (
    <div className="visual-panel" data-testid={`visual-story-${part.number}`}>
      <div className="visual-header"><span>DECEPTIQ / CORE VIEW</span><strong>{part.signal}</strong></div>
      <div className="visual-center">
        <LayeredCore progress={progress} activePart={index + 1} compact />
        <span className="viz-label label-a">ingest</span>
        <span className="viz-label label-b">signal</span>
        <span className="viz-label label-c">evidence</span>
        <span className="viz-label label-d">response</span>
      </div>
      <div className="visual-footer"><span>layer / {part.layer}</span><b>● synchronized</b></div>
    </div>
  );
}

function StoryStep({
  part,
  index,
  setRef,
  active,
}: {
  part: StoryPart;
  index: number;
  setRef: (node: HTMLElement | null) => void;
  active: boolean;
}) {
  return (
    <article ref={setRef} id={`part-${part.number}`} data-part-index={index} className={`story-step${active ? ' is-active' : ''}`} data-testid={`story-step-${part.number}`}>
      <div className={`step-number${part.accent === 'magenta' ? ' mono' : ''}`}>{part.number} / 10</div>
      <h3>{part.title}</h3>
      <p>{part.copy}</p>
      <div className="step-signal"><span className={`signal-dot${part.accent === 'magenta' ? ' magenta' : ''}`} />{part.signal}</div>
      <div className="step-card" data-testid={`status-card-${part.number}`}>
        <div className="step-card-head"><span>OBSERVATION / {part.short}</span><span>LIVE</span></div>
        {part.card.map((row) => <div className="step-card-row" key={row.label}><span>{row.label}</span><strong>{row.value}</strong></div>)}
      </div>
    </article>
  );
}

function LandingPage() {
  const [activePart, setActivePart] = useState(0);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);
  const progress = useScrollProgress();

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) {
        const next = Number((visible.target as HTMLElement).dataset.partIndex);
        if (!Number.isNaN(next)) setActivePart(next);
      }
    }, { rootMargin: '-25% 0px -48% 0px', threshold: [0.1, 0.45, 0.8] });
    stepRefs.current.forEach((step) => step && observer.observe(step));
    return () => observer.disconnect();
  }, []);

  const goToPart = (index: number) => {
    setActivePart(index);
    stepRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <main className="deceptiq-page">
      <header className={`topbar${progress > 0.02 ? ' is-scrolled' : ''}`}>
        <div className="topbar-inner">
          <Logo />
          <nav className="navlinks" aria-label="Primary navigation">
            <a href="#about" data-testid="link-about">About</a>
            <a href="#technology" data-testid="link-technology">Technology</a>
            <a href="#capabilities" data-testid="link-capabilities">Capabilities</a>
          </nav>
          <Link href={PORTAL_URL} className="topbar-portal" data-testid="link-portal-header">Enter DeceptIQ <ArrowUpRight size={13} /></Link>
        </div>
      </header>

      <section className="hero" id="about" data-testid="section-hero">
        <div className="container-wide hero-grid">
          <div className="hero-copy">
            <div className="hero-kicker"><span className="kicker-line" /><span className="eyebrow">Active defense / 01—10</span></div>
            <h1>Deception that <em>thinks ahead.</em></h1>
            <p className="hero-dek">Turn attacker behavior into evidence, intelligence and defensive clarity.</p>
            <div className="hero-actions">
              <a href="#capabilities" className="button-primary" data-testid="button-explore-core">Explore the system <ArrowDown size={15} /></a>
              <Link href={PORTAL_URL} className="button-ghost" data-testid="button-open-portal">Enter DeceptIQ <ArrowUpRight size={15} /></Link>
            </div>
            <div className="hero-index"><span>scroll to assemble</span><strong>01</strong><span>/</span><span>10</span></div>
          </div>
          <div className="core-stage" data-testid="visual-defense-core">
            <LayeredCore progress={progress} activePart={activePart} />
          </div>
        </div>
      </section>

      <section className="manifesto" id="technology" data-testid="section-manifesto">
        <div className="container-wide manifesto-grid">
          <div><span className="eyebrow">The premise</span><p className="manifesto-note">A defense surface for<br />security operators</p></div>
          <h2>Every intrusion is an attempt to tell you something. <span>We make sure you can hear it.</span></h2>
        </div>
      </section>

      <section id="capabilities" data-testid="section-story">
        <div className="container-wide story-intro">
          <span className="eyebrow">The DeceptIQ Cyber Defense Core</span>
          <h2>Turn attacker behavior into <em>defensive clarity.</em></h2>
        </div>
        <div className="container-wide story-layout">
          <aside className="story-index" aria-label="Story navigation">
            <p>Core sequence / {String(activePart + 2).padStart(2, '0')} of 10</p>
            <ol className="story-index-list">
              {storyParts.map((part, index) => (
                <li key={part.number}><button className={activePart === index ? 'is-active' : ''} onClick={() => goToPart(index)} data-testid={`button-part-${part.number}`} aria-current={activePart === index ? 'step' : undefined}><span>{part.number}</span>{part.short}</button></li>
              ))}
            </ol>
          </aside>
          <div className="story-content">
            {storyParts.map((part, index) => (
              <div key={part.number} data-part-index={index}>
                <StoryStep part={part} index={index} active={activePart === index} setRef={(node) => { stepRefs.current[index] = node; }} />
              </div>
            ))}
          </div>
          <div className="story-visual"><StoryVisual part={storyParts[activePart]} index={activePart} progress={progress} /></div>
        </div>
      </section>

      <section className="proof-band" aria-label="Core capabilities">
        <div className="container-wide proof-grid">
          <div className="proof-item"><strong>SESSIONS</strong><span>Replay every interaction</span></div>
          <div className="proof-item"><strong>ATT&amp;CK</strong><span>Map observed behavior</span></div>
          <div className="proof-item"><strong>D3FEND</strong><span>Connect verified guidance</span></div>
          <div className="proof-item"><strong>QWEN</strong><span>Explain recorded evidence</span></div>
        </div>
      </section>

      <section className="final-cta" data-testid="section-final-cta">
        <div className="container-wide final-grid">
          <div><span className="eyebrow">Final assembly / 10—10</span><h2>See deception become <em>intelligence.</em></h2></div>
          <div><p className="final-note">Enter the live DeceptIQ experience.</p><Link className="button-primary" href={PORTAL_URL} data-testid="button-enter-deceptiq">Enter DeceptIQ <ArrowUpRight size={15} /></Link></div>
        </div>
      </section>

      <footer className="footer">
        <div className="container-wide footer-inner">
          <span>© 2026 DeceptIQ / intelligence for the active defense</span>
          <div className="footer-links"><a href="#about" data-testid="link-footer-about">About</a><a href="#capabilities" data-testid="link-footer-core">Capabilities</a><Link href={PORTAL_URL} data-testid="link-footer-portal">Enter DeceptIQ</Link></div>
        </div>
      </footer>
    </main>
  );
}

function PortalPage() {
  return (
    <main className="portal-screen" data-testid="page-portal">
      <section className="portal-card">
        <Logo />
        <p className="portal-status">Portal handoff / local preview</p>
        <h1>The command center is ready.</h1>
        <p>This preview keeps the portal handoff local. Connect your operator session to continue into the live DeceptIQ dashboard.</p>
        <Link href="/" className="button-ghost" data-testid="button-return-home">Return to the core <ArrowDown size={15} /></Link>
      </section>
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path={PORTAL_URL} component={PortalPage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;