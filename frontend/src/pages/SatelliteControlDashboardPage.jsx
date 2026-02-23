import { Link } from 'react-router-dom';

const stats = [
  { label: 'CORE TEMP', value: '412 K', delta: '+2.4%' },
  { label: 'RADIATION', value: '6.8 mSv', delta: '-0.9%' },
  { label: 'LINK LATENCY', value: '148 ms', delta: '+4.1%' },
  { label: 'POWER LOAD', value: '73 %', delta: '+1.2%' },
];

const systems = [
  { name: 'ION THRUSTERS', value: 89 },
  { name: 'SOLAR ARRAY', value: 76 },
  { name: 'STAR NAVIGATION', value: 94 },
  { name: 'DEEP SPACE COMMS', value: 81 },
];

const events = [
  '22:14 UTC - Thermal correction completed on panel B.',
  '21:57 UTC - Relay delay spike during orbital handoff.',
  '21:23 UTC - Trajectory correction executed.',
  '20:41 UTC - Shielding diagnostics stable.',
];

const heatmapTones = [
  'bg-gradient-to-br from-thermal-orange/90 via-thermal-magenta/55 to-thermal-violet/25',
  'bg-gradient-to-br from-thermal-magenta/90 via-thermal-violet/55 to-thermal-orange/20',
  'bg-gradient-to-br from-thermal-violet/85 via-thermal-magenta/50 to-thermal-orange/30',
  'bg-gradient-to-br from-thermal-orange/80 via-thermal-violet/45 to-thermal-magenta/35',
];

export default function SatelliteControlDashboardPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-thermal-bg text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-thermal-orange/35 blur-3xl" />
        <div className="absolute left-1/3 top-6 h-[26rem] w-[26rem] rounded-full bg-thermal-magenta/30 blur-3xl" />
        <div className="absolute -right-24 top-20 h-[30rem] w-[30rem] rounded-full bg-thermal-violet/30 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-8">
        <header className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-mono text-xs tracking-[0.24em] text-slate-300">
                SAT-EX / ORBITAL CONTROL GRID
              </p>
              <h1 className="mt-2 font-sans text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                Exploration Satellite Control Dashboard
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-xl border border-thermal-orange/60 bg-gradient-to-r from-thermal-orange/30 via-thermal-magenta/35 to-thermal-violet/35 px-4 py-2 font-sans text-sm font-extrabold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,138,42,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-thermal-orange/70"
              >
                Start Deep Scan
              </button>
              <button
                type="button"
                className="rounded-xl border border-thermal-magenta/60 bg-white/10 px-4 py-2 font-sans text-sm font-extrabold text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,45,149,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-thermal-magenta/70"
              >
                Sync Telemetry
              </button>
              <Link
                to="/courses"
                className="rounded-xl border border-white/40 bg-slate-900/40 px-4 py-2 font-sans text-sm font-extrabold text-white transition-all duration-300 hover:shadow-[0_0_26px_rgba(255,255,255,0.4)]"
              >
                Back to App
              </Link>
            </div>
          </div>
        </header>

        <main className="mt-6 grid gap-6">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                <div className="mb-4 h-1 w-full rounded-full bg-gradient-to-r from-thermal-orange via-thermal-magenta to-thermal-violet bg-[length:200%_200%] animate-thermal-flow" />
                <p className="font-sans text-xs font-extrabold tracking-[0.16em] text-slate-300">
                  {item.label}
                </p>
                <p className="mt-2 font-mono text-3xl font-semibold text-white">{item.value}</p>
                <p className="mt-2 font-mono text-xs text-thermal-orange">{item.delta}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <article className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] xl:col-span-2">
              <h2 className="font-sans text-xl font-extrabold text-white">Orbital Thermal Map</h2>
              <p className="mt-1 font-mono text-xs text-slate-300">
                Thermal glow scale: orange to magenta to violet
              </p>

              <div className="mt-5 grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-12">
                {Array.from({ length: 36 }).map((_, index) => (
                  <div
                    key={`cell-${index + 1}`}
                    className={`h-10 rounded-md ${
                      heatmapTones[index % heatmapTones.length]
                    } shadow-[inset_0_0_14px_rgba(255,255,255,0.14)]`}
                  />
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <h2 className="font-sans text-xl font-extrabold text-white">Subsystem Health</h2>
              <div className="mt-4 space-y-4">
                {systems.map((system) => (
                  <div key={system.name}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-sans text-sm font-extrabold text-slate-200">
                        {system.name}
                      </span>
                      <span className="font-mono text-xs text-slate-300">{system.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-900/70">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-thermal-orange via-thermal-magenta to-thermal-violet"
                        style={{ width: `${system.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <h2 className="font-sans text-xl font-extrabold text-white">Mission Event Log</h2>
              <ul className="mt-4 space-y-3">
                {events.map((event) => (
                  <li
                    key={event}
                    className="rounded-xl border border-white/15 bg-slate-900/40 px-4 py-3 font-mono text-sm text-slate-200"
                  >
                    {event}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <h2 className="font-sans text-xl font-extrabold text-white">Critical Commands</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="rounded-xl border border-thermal-violet/60 bg-slate-900/50 px-4 py-3 font-sans text-sm font-extrabold text-white transition-all duration-300 hover:shadow-[0_0_28px_rgba(122,92,255,0.65)]"
                >
                  Orbit Correction
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-thermal-magenta/60 bg-slate-900/50 px-4 py-3 font-sans text-sm font-extrabold text-white transition-all duration-300 hover:shadow-[0_0_28px_rgba(255,45,149,0.65)]"
                >
                  Recalibrate Sensors
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-thermal-orange/60 bg-slate-900/50 px-4 py-3 font-sans text-sm font-extrabold text-white transition-all duration-300 hover:shadow-[0_0_28px_rgba(255,138,42,0.65)]"
                >
                  Memory Purge
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-white/35 bg-slate-900/50 px-4 py-3 font-sans text-sm font-extrabold text-white transition-all duration-300 hover:shadow-[0_0_28px_rgba(255,255,255,0.45)]"
                >
                  Safe Reboot
                </button>
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
