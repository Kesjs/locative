"use client";

import { PROOF_METRICS } from "./landing-data";

export default function Stats() {
  return (
    <section id="preuves" className="landing-section bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div data-landing-reveal className="grid border-y border-border-default sm:grid-cols-4">
          {PROOF_METRICS.map((metric, index) => (
            <div key={metric.label} className={`py-5 sm:px-5 sm:py-6 ${index < PROOF_METRICS.length - 1 ? "border-b border-border-default sm:border-b-0 sm:border-r" : ""}`}>
              <p className="tabular-nums text-[26px] font-semibold tracking-[-0.06em] text-text-primary sm:text-[30px]">{metric.value}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">{metric.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-text-muted">Repères de démonstration Lokka · à contextualiser avec une source ou une date avant publication.</p>
      </div>
    </section>
  );
}
