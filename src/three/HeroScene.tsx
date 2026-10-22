import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

// Floating CV cards, a match ring and a particle field. Loaded lazily so the page text renders first.
// One renderer for the page; particle count kept low for phones (ui-ux-pro-max threejs guidance).

type CardSpec = { name: string; role: string; score: number; pos: [number, number, number]; rot: [number, number, number]; speed: number }

const CARDS: CardSpec[] = [
  { name: 'Data Analyst', role: 'JP1024', score: 92, pos: [0.15, 0, 0.4], rot: [0, -0.18, 0.04], speed: 1.4 },
  { name: 'Finance Executive', role: 'JP1019', score: 78, pos: [-1.75, 0.55, -0.9], rot: [0.05, 0.28, 0.1], speed: 1.1 },
  { name: 'Software Engineer', role: 'JP1031', score: 85, pos: [1.9, -0.45, -1.3], rot: [-0.04, -0.4, -0.08], speed: 1.25 },
]

function cvTexture(spec: CardSpec) {
  const w = 600, h = 800
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const g = c.getContext('2d')!
  const font = (weight: number, size: number) => `${weight} ${size}px "Segoe UI", system-ui, sans-serif`
  const bar = (x: number, y: number, bw: number, bh: number, color: string) => {
    g.fillStyle = color
    g.beginPath(); g.roundRect(x, y, bw, bh, bh / 2); g.fill()
  }

  g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h)
  const grad = g.createLinearGradient(0, 0, w, 160)
  grad.addColorStop(0, '#0a66c2'); grad.addColorStop(1, '#004182')
  g.fillStyle = grad; g.fillRect(0, 0, w, 150)

  // avatar
  g.fillStyle = '#ffffff'; g.beginPath(); g.arc(110, 150, 66, 0, Math.PI * 2); g.fill()
  g.fillStyle = '#dce6f1'; g.beginPath(); g.arc(110, 150, 58, 0, Math.PI * 2); g.fill()
  g.fillStyle = '#0a66c2'; g.beginPath(); g.arc(110, 132, 22, 0, Math.PI * 2); g.fill()
  g.beginPath(); g.ellipse(110, 186, 36, 22, 0, Math.PI, 0); g.fill()

  g.fillStyle = '#ffffff'; g.font = font(600, 30); g.fillText(spec.role, 200, 70)
  g.fillStyle = '#1d2226'; g.font = font(700, 40); g.fillText(spec.name, 48, 270)
  bar(48, 296, 260, 16, '#e3e8ef')

  // match pill
  const good = spec.score >= 80
  g.fillStyle = good ? '#e3f1ea' : '#fbefdc'
  g.beginPath(); g.roundRect(48, 340, 230, 64, 32); g.fill()
  g.fillStyle = good ? '#057642' : '#915907'; g.font = font(700, 32)
  g.fillText(`${spec.score}% match`, 74, 384)

  // body lines
  let y = 450
  for (const width of [480, 440, 500, 300]) { bar(48, y, width, 18, '#eef1f5'); y += 38 }
  y += 20
  g.fillStyle = '#5b6570'; g.font = font(600, 24); g.fillText('SKILLS', 48, y); y += 26
  let x = 48
  for (const t of ['Power BI', 'SQL', 'Excel']) {
    const tw = g.measureText(t).width + 40
    g.fillStyle = '#dce6f1'; g.beginPath(); g.roundRect(x, y, tw, 46, 23); g.fill()
    g.fillStyle = '#0a66c2'; g.font = font(600, 22); g.fillText(t, x + 20, y + 31)
    x += tw + 12
  }

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

function CvCard({ spec }: { spec: CardSpec }) {
  const tex = useMemo(() => cvTexture(spec), [spec])
  useEffect(() => () => tex.dispose(), [tex])
  return (
    <Float speed={spec.speed} rotationIntensity={0.35} floatIntensity={0.7}>
      <group position={spec.pos} rotation={spec.rot}>
        <RoundedBox args={[1.86, 2.46, 0.05]} radius={0.06} smoothness={4}>
          <meshStandardMaterial color="#f4f7fb" roughness={0.35} metalness={0.05} />
        </RoundedBox>
        <mesh position={[0, 0, 0.027]}>
          <planeGeometry args={[1.74, 2.32]} />
          <meshBasicMaterial map={tex} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  )
}

function MatchRing() {
  const ref = useRef<THREE.Group>(null)
  const arc = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z -= dt * 0.25
    if (arc.current) {
      const m = arc.current.material as THREE.MeshStandardMaterial
      m.emissiveIntensity = 1.6 + Math.sin(performance.now() / 500) * 0.4
    }
  })
  return (
    <Float speed={2} floatIntensity={0.9} rotationIntensity={0.2}>
      <group position={[1.05, 1.25, 1.1]}>
        <group ref={ref}>
          <mesh>
            <torusGeometry args={[0.42, 0.035, 16, 96]} />
            <meshStandardMaterial color="#1b3550" roughness={0.6} />
          </mesh>
          <mesh ref={arc}>
            <torusGeometry args={[0.42, 0.06, 16, 96, Math.PI * 2 * 0.92]} />
            <meshStandardMaterial color="#4cc3e0" emissive="#4cc3e0" emissiveIntensity={1.6} roughness={0.3} />
          </mesh>
        </group>
        <mesh>
          <circleGeometry args={[0.3, 48]} />
          <meshStandardMaterial color="#0a66c2" emissive="#0a66c2" emissiveIntensity={0.6} />
        </mesh>
        <Check />
      </group>
    </Float>
  )
}

function Check() {
  const geo = useMemo(() => {
    const path = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.13, 0, 0.02), new THREE.Vector3(-0.03, -0.1, 0.02), new THREE.Vector3(0.15, 0.12, 0.02)], false, 'catmullrom', 0)
    return new THREE.TubeGeometry(path, 32, 0.03, 12, false)
  }, [])
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} />
    </mesh>
  )
}

function Particles({ count = 1400 }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 7
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      p[i * 3] = r * Math.sin(ph) * Math.cos(th)
      p[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.6
      p[i * 3 + 2] = r * Math.cos(ph) - 3
    }
    return p
  }, [count])
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.02 })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#70b5f9" transparent opacity={0.8} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

// Follows the pointer, eases in on load and drifts up and back as the hero scrolls away.
function Rig({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state, dt) => {
    const g = ref.current
    if (!g) return
    const s = Math.min(window.scrollY / window.innerHeight, 1.2)
    const d = THREE.MathUtils.damp
    g.rotation.y = d(g.rotation.y, state.pointer.x * 0.35 + s * 0.4, 3, dt)
    g.rotation.x = d(g.rotation.x, -state.pointer.y * 0.18 + s * 0.25, 3, dt)
    g.position.y = d(g.position.y, s * 1.6, 4, dt)
    g.position.z = d(g.position.z, -s * 2, 4, dt)
    const k = d(g.scale.x, 1, 2.5, dt)
    g.scale.setScalar(k)
  })
  return <group ref={ref} scale={0.55}>{children}</group>
}

export default function HeroScene({ reduced }: { reduced: boolean }) {
  const wrap = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [eventSource, setEventSource] = useState<HTMLElement | undefined>()
  const small = window.matchMedia('(max-width: 720px)').matches

  useEffect(() => {
    setEventSource(document.getElementById('root') ?? undefined)
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    if (wrap.current) io.observe(wrap.current)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrap} className="hero-canvas" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, small ? 12 : 10], fov: 35 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={reduced ? 'demand' : visible ? 'always' : 'never'}
        eventSource={eventSource}
        eventPrefix="client"
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 5]} intensity={1.4} />
        <pointLight position={[-4, -2, 3]} intensity={30} color="#4cc3e0" />
        <Particles count={small ? 700 : 1400} />
        <Rig>
          <group position={small ? [0, 0.6, -1] : [0.5, -0.1, 0]}>
            {CARDS.map(c => <CvCard key={c.role} spec={c} />)}
            <MatchRing />
          </group>
        </Rig>
      </Canvas>
    </div>
  )
}
