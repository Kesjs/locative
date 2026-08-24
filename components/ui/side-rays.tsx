"use client";

import { useRef, useEffect, useCallback, useMemo } from "react";

export type SideRaysOrigin =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left";

interface SideRaysProps {
  speed?: number;
  rayColor1?: string;
  rayColor2?: string;
  intensity?: number;
  spread?: number;
  origin?: SideRaysOrigin;
  tilt?: number;
  saturation?: number;
  blend?: number;
  falloff?: number;
  opacity?: number;
  className?: string;
}

interface WebGLUniforms {
  iTime: { value: number };
  iResolution: { value: [number, number] };
  iSpeed: { value: number };
  iRayColor1: { value: [number, number, number] };
  iRayColor2: { value: [number, number, number] };
  iIntensity: { value: number };
  iSpread: { value: number };
  iFlipX: { value: number };
  iFlipY: { value: number };
  iTilt: { value: number };
  iSaturation: { value: number };
  iBlend: { value: number };
  iFalloff: { value: number };
  iOpacity: { value: number };
}

const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? [
        parseInt(m[1], 16) / 255,
        parseInt(m[2], 16) / 255,
        parseInt(m[3], 16) / 255,
      ]
    : [1, 1, 1];
};

const originToFlip = (origin: SideRaysOrigin): [number, number] => {
  switch (origin) {
    case "top-left":
      return [1, 0];
    case "bottom-right":
      return [0, 1];
    case "bottom-left":
      return [1, 1];
    default:
      return [0, 0];
  }
};

const vertexShader = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragmentShader = `precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform float iSpeed;
uniform vec3 iRayColor1;
uniform vec3 iRayColor2;
uniform float iIntensity;
uniform float iSpread;
uniform float iFlipX;
uniform float iFlipY;
uniform float iTilt;
uniform float iSaturation;
uniform float iBlend;
uniform float iFalloff;
uniform float iOpacity;

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
  return clamp(
    (0.45 + 0.15 * sin(cosAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-cosAngle * seedB + iTime * speed)),
    0.0, 1.0) *
    clamp((iResolution.x - length(sourceToCoord)) / iResolution.x, 0.5, 1.0);
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  if (iFlipX > 0.5) fragCoord.x = iResolution.x - fragCoord.x;
  if (iFlipY > 0.5) fragCoord.y = iResolution.y - fragCoord.y;

  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  vec2 rayPos = vec2(iResolution.x * 1.1, -0.5 * iResolution.y);

  float tiltRad = iTilt * 3.14159265 / 180.0;
  float cs = cos(tiltRad);
  float sn = sin(tiltRad);
  vec2 rel = coord - rayPos;
  vec2 tiltedCoord = vec2(rel.x * cs - rel.y * sn, rel.x * sn + rel.y * cs) + rayPos;

  float halfSpread = iSpread * 0.275;
  vec2 rayRefDir1 = normalize(vec2(cos(0.785398 + halfSpread), sin(0.785398 + halfSpread)));
  vec2 rayRefDir2 = normalize(vec2(cos(0.785398 - halfSpread), sin(0.785398 - halfSpread)));

  vec4 rays1 = vec4(iRayColor1, 1.0) * rayStrength(rayPos, rayRefDir1, tiltedCoord, 36.2214, 21.11349, iSpeed);
  vec4 rays2 = vec4(iRayColor2, 1.0) * rayStrength(rayPos, rayRefDir2, tiltedCoord, 22.3991, 18.0234, iSpeed * 0.2);

  vec4 color = rays1 * (1.0 - iBlend) * 0.9 + rays2 * iBlend * 0.9;

  float distanceToLight = length(fragCoord.xy - vec2(rayPos.x, iResolution.y - rayPos.y)) / iResolution.y;
  float brightness = iIntensity * 0.4 / pow(max(distanceToLight, 0.001), iFalloff);
  color.rgb *= brightness;

  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  color.rgb = mix(vec3(gray), color.rgb, iSaturation);

  color.a = max(color.r, max(color.g, color.b)) * iOpacity;
  gl_FragColor = color;
}`;

export default function SideRays({
  speed = 2.5,
  rayColor1 = "#27FF64",
  rayColor2 = "#A8FFB6",
  intensity = 2,
  spread = 2,
  origin = "top-right",
  tilt = 0,
  saturation = 1.5,
  blend = 0.75,
  falloff = 2.0,
  opacity = 1.0,
  className = "",
}: SideRaysProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<WebGLUniforms | null>(null);
  const rendererRef = useRef<unknown>(null);
  const animationIdRef = useRef<number | null>(null);
  const meshRef = useRef<unknown>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const isVisibleRef = useRef(false);
  const propsRef = useRef({
    speed,
    rayColor1,
    rayColor2,
    intensity,
    spread,
    origin,
    tilt,
    saturation,
    blend,
    falloff,
    opacity,
  });

  // Keep propsRef in sync
  propsRef.current = {
    speed,
    rayColor1,
    rayColor2,
    intensity,
    spread,
    origin,
    tilt,
    saturation,
    blend,
    falloff,
    opacity,
  };

  const rgb1 = useMemo(() => hexToRgb(rayColor1), [rayColor1]);
  const rgb2 = useMemo(() => hexToRgb(rayColor2), [rayColor2]);
  const [flipX, flipY] = useMemo(() => originToFlip(origin), [origin]);

  // Update uniforms when props change
  useEffect(() => {
    if (!uniformsRef.current) return;
    const u = uniformsRef.current;
    u.iSpeed.value = speed;
    u.iRayColor1.value = rgb1;
    u.iRayColor2.value = rgb2;
    u.iIntensity.value = intensity;
    u.iSpread.value = spread;
    u.iFlipX.value = flipX;
    u.iFlipY.value = flipY;
    u.iTilt.value = tilt;
    u.iSaturation.value = saturation;
    u.iBlend.value = blend;
    u.iFalloff.value = falloff;
    u.iOpacity.value = opacity;
  }, [
    speed,
    rgb1,
    rgb2,
    intensity,
    spread,
    flipX,
    flipY,
    tilt,
    saturation,
    blend,
    falloff,
    opacity,
  ]);

  const initializeWebGL = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;

    // Dynamic import ogl (client-only)
    const { Renderer, Program, Triangle, Mesh } = await import("ogl");

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    try {
      const renderer = new Renderer({ dpr, alpha: true });
      rendererRef.current = renderer;

      const gl = renderer.gl;
      gl.canvas.style.width = "100%";
      gl.canvas.style.height = "100%";

      // Clear container
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(gl.canvas);

      const p = propsRef.current;
      const [fX, fY] = originToFlip(p.origin);
      const uniforms: WebGLUniforms = {
        iTime: { value: 0 },
        iResolution: { value: [1, 1] },
        iSpeed: { value: p.speed },
        iRayColor1: { value: hexToRgb(p.rayColor1) },
        iRayColor2: { value: hexToRgb(p.rayColor2) },
        iIntensity: { value: p.intensity },
        iSpread: { value: p.spread },
        iFlipX: { value: fX },
        iFlipY: { value: fY },
        iTilt: { value: p.tilt },
        iSaturation: { value: p.saturation },
        iBlend: { value: p.blend },
        iFalloff: { value: p.falloff },
        iOpacity: { value: p.opacity },
      };
      uniformsRef.current = uniforms;

      const geometry = new Triangle(gl);
      const program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms,
      });
      const mesh = new Mesh(gl, { geometry, program });
      meshRef.current = mesh;

      const updateSize = () => {
        if (!container || !renderer) return;
        renderer.dpr = Math.min(window.devicePixelRatio || 1, 2);
        const { clientWidth: w, clientHeight: h } = container;
        renderer.setSize(w, h);
        uniforms.iResolution.value = [w * renderer.dpr, h * renderer.dpr];
      };

      const loop = (t: number) => {
        if (!rendererRef.current || !uniformsRef.current || !meshRef.current || !isVisibleRef.current) return;
        uniforms.iTime.value = t * 0.001;
        try {
          renderer.render({ scene: mesh });
          animationIdRef.current = requestAnimationFrame(loop);
        } catch (error) {
          console.warn("WebGL rendering error:", error);
        }
      };

      window.addEventListener("resize", updateSize, { passive: true });
      updateSize();
      animationIdRef.current = requestAnimationFrame(loop);

      cleanupRef.current = () => {
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
          animationIdRef.current = null;
        }
        window.removeEventListener("resize", updateSize);
        try {
          const loseCtx = renderer.gl.getExtension("WEBGL_lose_context");
          if (loseCtx) loseCtx.loseContext();
          const canvas = renderer.gl.canvas;
          if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
        } catch (error) {
          console.warn("Error during WebGL cleanup:", error);
        }
        rendererRef.current = null;
        uniformsRef.current = null;
        meshRef.current = null;
      };
    } catch (error) {
      console.error("Failed to initialize WebGL:", error);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const wasVisible = isVisibleRef.current;
        isVisibleRef.current = entry.isIntersecting;

        if (entry.isIntersecting && !wasVisible) {
          // Became visible — initialize or resume
          if (cleanupRef.current) {
            cleanupRef.current();
            cleanupRef.current = null;
          }
          initializeWebGL();
        } else if (!entry.isIntersecting && wasVisible) {
          // Hidden — pause animation
          if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current);
            animationIdRef.current = null;
          }
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [initializeWebGL]);

  return (
    <div
      ref={containerRef}
      className={`${className}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 3,
      }}
    />
  );
}
