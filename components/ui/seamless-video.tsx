"use client";

import { useEffect, useRef, useState } from "react";

interface SeamlessVideoProps {
  src: string;
  crossfadeDuration?: number;
  style?: React.CSSProperties;
}

export default function SeamlessVideo({
  src,
  crossfadeDuration = 2.0,
  style,
}: SeamlessVideoProps) {
  const videoRefA = useRef<HTMLVideoElement>(null);
  const videoRefB = useRef<HTMLVideoElement>(null);

  const [activeVideo, setActiveVideo] = useState<"A" | "B">("A");
  const [bReady, setBReady] = useState(false);

  useEffect(() => {
    const vA = videoRefA.current;
    const vB = videoRefB.current;

    if (!vA || !vB) return;

    vA.defaultMuted = true;
    vA.muted = true;
    vB.defaultMuted = true;
    vB.muted = true;

    // Start Video A immediately
    vA.play().catch(() => {});

    // Start Video B offset by half the duration once metadata is loaded
    const handleLoadedMetadata = () => {
      if (vA && vB && Number.isFinite(vA.duration) && vA.duration > 0) {
        const offsetTime = vA.duration / 2;

        if (Number.isFinite(offsetTime)) {
          try {
            vB.currentTime = offsetTime;
          } catch (e) {
            console.warn("Could not set vB.currentTime:", e);
          }
          vB.play().catch(() => {});
          setBReady(true);
        }
      }
    };

    if (vA.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      vA.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    return () => {
      vA.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [src]);

  // Monitor playback to crossfade BEFORE each video reaches its jump point
  useEffect(() => {
    if (!bReady) return;

    const vA = videoRefA.current;
    const vB = videoRefB.current;
    if (!vA || !vB) return;

    let animId: number;

    const tick = () => {
      const active = activeVideo === "A" ? vA : vB;

      if (active && Number.isFinite(active.duration) && active.duration > 0) {
        const timeLeft = active.duration - active.currentTime;

        // Switch to the other video 2 seconds BEFORE reaching the end jump point
        if (timeLeft <= crossfadeDuration) {
          setActiveVideo((prev) => (prev === "A" ? "B" : "A"));
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [activeVideo, bReady, crossfadeDuration]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#0B0F19",
        ...style,
      }}
    >
      {/* Video A */}
      <video
        ref={videoRefA}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: activeVideo === "A" ? 2 : 1,
          opacity: activeVideo === "A" ? 1 : 0,
          transition: `opacity ${crossfadeDuration}s ease-in-out`,
          willChange: "opacity",
        }}
      />

      {/* Video B (Offset by 50%) */}
      <video
        ref={videoRefB}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: activeVideo === "B" ? 2 : 1,
          opacity: activeVideo === "B" ? 1 : 0,
          transition: `opacity ${crossfadeDuration}s ease-in-out`,
          willChange: "opacity",
        }}
      />
    </div>
  );
}
