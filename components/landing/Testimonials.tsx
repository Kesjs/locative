"use client";

import { Quote } from "lucide-react";
import { TESTIMONIALS } from "./landing-data";

export default function Testimonials() {
  return (
    <section id="testimonials" className="landing-section bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div data-landing-reveal className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div className="max-w-[350px]"><p className="landing-label">Notes de terrain</p><h2 className="mt-4 text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1] tracking-[-0.06em] text-text-primary">Des traces qui parlent<span className="mt-1 block font-serif font-normal italic text-text-secondary">à chaque métier.</span></h2></div>
          <div className="divide-y divide-border-default border-y border-border-default">{TESTIMONIALS.map((testimonial, index) => <figure key={testimonial.name} data-landing-reveal className={`py-6 sm:py-7 ${index === 0 ? "border-l-2 border-success-strong pl-4 sm:pl-6" : "pl-4 sm:pl-6"}`}><Quote aria-hidden="true" size={17} className="mb-3 text-text-muted" /><blockquote className="max-w-[760px] text-[15px] leading-[1.65] text-text-primary sm:text-[16px]">“{testimonial.quote}”</blockquote><figcaption className="mt-4 text-[11px] font-medium text-text-secondary"><span className="font-semibold text-text-primary">{testimonial.name}</span> · {testimonial.role}</figcaption></figure>)}</div>
        </div>
      </div>
    </section>
  );
}
