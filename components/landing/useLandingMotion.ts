"use client";

import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useLandingMotion(rootRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add(
        {
          reducedMotion: "(prefers-reduced-motion: reduce)",
          desktop: "(min-width: 1024px)",
        },
        ({ conditions }) => {
          const reducedMotion = Boolean(conditions?.reducedMotion);
          const isDesktop = Boolean(conditions?.desktop);

          if (reducedMotion) {
            gsap.set("[data-landing-reveal]", { autoAlpha: 1, x: 0, y: 0 });
            gsap.set("[data-dashboard-3d]", {
              autoAlpha: 1,
              rotationX: 0,
              rotationY: 0,
              scale: 1,
              y: 0,
            });
            gsap.set("[data-dashboard-line]", { scaleX: 1 });
            gsap.set("[data-dashboard-bar]", { scaleY: 1 });
            return;
          }

          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .from("[data-landing-hero-copy]", { autoAlpha: 0, y: 22, duration: 0.62 })
            .from("[data-landing-hero-form]", { autoAlpha: 0, y: 14, duration: 0.46 }, "-=0.34")
            .from(
              "[data-dashboard-3d]",
              { autoAlpha: 0, y: 34, rotationX: 9, rotationY: -4, scale: 0.98, duration: 0.9 },
              "-=0.2"
            );

          gsap.to("[data-dashboard-scroll]", {
            y: -14,
            rotationX: 0,
            rotationY: 0,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-dashboard-stage]",
              start: "top 82%",
              end: "bottom 56%",
              scrub: 0.6,
            },
          });

          gsap.utils.toArray<HTMLElement>("[data-landing-reveal]").forEach((element) => {
            gsap.from(element, {
              autoAlpha: 0,
              y: 20,
              duration: 0.62,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 84%",
                once: true,
              },
            });
          });

          gsap.from("[data-dashboard-line]", {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.85,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: "[data-proof-section]",
              start: "top 78%",
              once: true,
            },
          });

          if (isDesktop) {
            const stage = root.querySelector<HTMLElement>("[data-dashboard-stage]");
            const hoverLayer = root.querySelector<HTMLElement>("[data-dashboard-hover]");
            if (stage && hoverLayer) {
              const rotateXTo = gsap.quickTo(hoverLayer, "rotationX", { duration: 0.35, ease: "power3.out" });
              const rotateYTo = gsap.quickTo(hoverLayer, "rotationY", { duration: 0.35, ease: "power3.out" });

              const handlePointerMove = (event: PointerEvent) => {
                const bounds = stage.getBoundingClientRect();
                const x = (event.clientX - bounds.left) / bounds.width - 0.5;
                const y = (event.clientY - bounds.top) / bounds.height - 0.5;
                rotateXTo(y * -2.4);
                rotateYTo(x * 3.2);
              };
              const resetPointer = () => {
                rotateXTo(0);
                rotateYTo(0);
              };

              stage.addEventListener("pointermove", handlePointerMove);
              stage.addEventListener("pointerleave", resetPointer);

              return () => {
                stage.removeEventListener("pointermove", handlePointerMove);
                stage.removeEventListener("pointerleave", resetPointer);
              };
            }
          }

          return undefined;
        }
      );
    }, root);

    return () => context.revert();
  }, [rootRef]);
}
