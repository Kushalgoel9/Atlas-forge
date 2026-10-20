import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useActiveValues } from '../forge/core'

/* One WebGL canvas behind the whole site: an ivory paper shader with a slow amber light bleed,
   a star chart that draws itself in as you scroll, and faint map lines. Everything reads the
   active Forge values (accent, paper, art opacity, parallax) so the panel drives the scene too.
   It draws nothing when reduced motion is set or WebGL is unavailable; the CSS paper stays. */

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`

const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime, uScroll, uArt, uAspect, uDark;
  uniform vec2 uMouse;
  uniform vec3 uPaper, uAccent;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }
  float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }

  // Star chart: constellation points on a jittered grid, with hairline links drawn in by scroll.
  float stars(vec2 uv, float reveal) {
    vec2 g = uv * 9.0;
    vec2 id = floor(g);
    float v = 0.0;
    for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
      vec2 o = vec2(float(x), float(y));
      vec2 cell = id + o;
      float h = hash(cell);
      if (h < 0.6) continue;
      vec2 p = cell + 0.5 + 0.35 * (vec2(hash(cell + 1.7), hash(cell + 3.1)) - 0.5);
      float d = length(g - p);
      float appear = smoothstep(h, h + 0.08, reveal);
      v += appear * (0.9 * smoothstep(0.035, 0.0, d) + 0.3 * smoothstep(0.01, 0.0, abs(d - 0.08)));
      // link to the next cell on the right, as a hairline
      vec2 cell2 = cell + vec2(1.0, 0.0);
      if (hash(cell2) >= 0.6 && hash(cell + 9.3) > 0.4) {
        vec2 p2 = cell2 + 0.5 + 0.35 * (vec2(hash(cell2 + 1.7), hash(cell2 + 3.1)) - 0.5);
        vec2 a = g - p, b = p2 - p;
        float t = clamp(dot(a, b) / dot(b, b), 0.0, 1.0);
        float dl = length(a - b * t);
        v += appear * smoothstep(0.3, 0.9, reveal) * 0.5 * smoothstep(0.008, 0.0, dl) * step(t, reveal);
      }
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = vec2(uv.x * uAspect, uv.y);
    float t = uTime * 0.05;

    // paper grain
    float grain = (hash(uv * 1400.0 + fract(uTime)) - 0.5) * 0.035;

    // slow amber light bleed from the top right, nudged by the cursor
    vec2 lightPos = vec2(0.82 * uAspect, 0.9) + (uMouse - 0.5) * 0.25;
    float bleed = fbm(p * 1.3 + t) * 0.6 + 0.4;
    float glow = smoothstep(1.05, 0.0, length(p - lightPos)) * bleed;

    // a second cooler pool bottom left
    float pool = smoothstep(1.3, 0.0, length(p - vec2(0.1, 0.15 - uScroll * 0.2))) * fbm(p * 2.0 - t);

    vec3 col = uPaper;
    col = mix(col, uAccent, glow * (0.11 + 0.08 * uDark) * uArt);
    col = mix(col, uAccent, pool * 0.05 * uArt);

    // star chart above the fold, reveals with scroll and parallaxes with the cursor
    vec2 su = p + (uMouse - 0.5) * 0.04 + vec2(0.0, uScroll * 0.35);
    float s = stars(su, 0.35 + uScroll * 1.4);
    col = mix(col, uAccent, clamp(s, 0.0, 1.0) * (0.7 + 0.3 * uDark) * uArt);

    // map lines: contour bands from fbm, very faint
    // map contours: sparse hairlines, fading toward the right so the hero text stays clean
    float m = fbm(p * 2.2 + vec2(0.0, uScroll * 0.5));
    float contour = smoothstep(0.02, 0.0, abs(fract(m * 5.0) - 0.5)) * (1.0 - smoothstep(0.1, 0.9, uv.x));
    col = mix(col, uAccent, contour * 0.07 * uArt);

    col += grain;
    gl_FragColor = vec4(col, 1.0);
  }
`

function hex(c: string) {
  const col = new THREE.Color(c)
  return new THREE.Vector3(col.r, col.g, col.b)
}

function Paper({ values }: { values: Record<string, unknown> | null }) {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const { size } = useThree()
  const mouse = useRef(new THREE.Vector2(0.5, 0.5))
  const target = useRef(new THREE.Vector2(0.5, 0.5))
  const scroll = useRef(0)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uArt: { value: 0.55 },
      uAspect: { value: 1 },
      uDark: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uPaper: { value: hex('#f8f5f1') },
      uAccent: { value: hex('#9e591a') },
    }),
    [],
  )

  useEffect(() => {
    const onMove = (e: PointerEvent) => target.current.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight)
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      scroll.current = window.scrollY / max
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const paper = String(values?.paper ?? '#f8f5f1')
  const accent = String(values?.accent ?? '#9e591a')
  const dark = values?.theme === 'dark'
  const art = Number(values?.art ?? 0.55)
  const parallax = Number(values?.parallax ?? 1)

  useFrame((_, dt) => {
    const u = mat.current?.uniforms
    if (!u) return
    u.uTime.value += dt
    u.uAspect.value = size.width / size.height
    mouse.current.lerp(target.current, 1 - Math.pow(0.001, dt))
    u.uMouse.value.set(0.5 + (mouse.current.x - 0.5) * parallax, 0.5 + (mouse.current.y - 0.5) * parallax)
    u.uScroll.value += (scroll.current - u.uScroll.value) * (1 - Math.pow(0.002, dt))
    u.uArt.value = art
    u.uDark.value = dark ? 1 : 0
    u.uPaper.value.lerp(hex(dark ? '#15120e' : paper), 0.1)
    u.uAccent.value.lerp(hex(dark ? lift(accent) : accent), 0.1)
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} depthTest={false} depthWrite={false} />
    </mesh>
  )
}

/* Dark theme lifts the accent toward the lighter amber used in the Dark Figma variables. */
export function lift(c: string) {
  const col = new THREE.Color(c)
  const hsl = { h: 0, s: 0, l: 0 }
  col.getHSL(hsl)
  col.setHSL(hsl.h, hsl.s, Math.max(hsl.l, 0.6))
  return '#' + col.getHexString()
}

export function Scene() {
  const values = useActiveValues()
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    setEnabled(!reduced && !!gl)
  }, [])
  if (!enabled) return null
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <Canvas dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: 'low-power' }} frameloop="always" orthographic camera={{ position: [0, 0, 1] }}>
        <Paper values={values} />
      </Canvas>
    </div>
  )
}
