import {
  WebGLRenderer, Scene, PerspectiveCamera, Color, Group, Mesh, CylinderGeometry, CircleGeometry,
  RingGeometry, MeshBasicMaterial, TextureLoader, PlaneGeometry as PlaneGeo, ShaderMaterial, DoubleSide, BackSide, TorusGeometry, CanvasTexture,
  SRGBColorSpace, AdditiveBlending
} from 'three'

const WALL_R = 9
const WALL_H = 4.6
const ARC = (120 * Math.PI) / 180
const PIT_R = 2.2
const PIT_Z = 2.4

const wallVert = `
varying vec2 vUv;
varying float vY;
void main(){
  vUv = uv;
  vec4 wp = modelMatrix * vec4(position,1.0);
  vY = wp.y;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`

const wallFrag = `
precision highp float;
varying vec2 vUv;
varying float vY;
uniform float uMirror;
uniform float uTime;
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
void main(){
  float v = clamp(abs(vY) / ${WALL_H.toFixed(1)}, 0.0, 1.0);
  float edge = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);
  vec3 c = mix(vec3(0.012,0.020,0.040), vec3(0.004,0.008,0.018), smoothstep(0.0, 0.7, v));
  c += vec3(0.10,0.15,0.26) * pow(v, 14.0) * 0.55;
  c += vec3(0.05,0.08,0.15) * pow(1.0 - v, 12.0) * 0.5;
  c *= 0.7 + 0.3 * edge;
  c += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.012;
  float a = 1.0;
  if (uMirror > 0.5) { c *= 0.5; a = 1.0 - smoothstep(0.0, 0.5, v); }
  gl_FragColor = vec4(c, a);
}`

function radialTexture() {
  const c = document.createElement('canvas')
  c.width = 1024; c.height = 576
  const x = c.getContext('2d')
  x.fillStyle = '#020611'; x.fillRect(0, 0, 1024, 576)
  x.save(); x.translate(512, 0); x.scale(1.8, 1)
  const u = x.createRadialGradient(0, 30, 0, 0, 30, 330)
  u.addColorStop(0, 'rgba(165,188,225,1)'); u.addColorStop(0.2, 'rgba(110,135,175,.9)'); u.addColorStop(0.55, 'rgba(62,82,115,.8)'); u.addColorStop(1, 'rgba(14,22,40,.35)')
  x.fillStyle = u; x.fillRect(-600, 0, 1200, 360); x.restore()
  const f = x.createLinearGradient(0, 0, 0, 576)
  f.addColorStop(0.55, 'rgba(2,6,17,0)'); f.addColorStop(0.7, 'rgba(1,4,12,1)'); f.addColorStop(1, 'rgba(1,3,9,1)')
  x.fillStyle = f; x.fillRect(0, 0, 1024, 576)
  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  return t
}

const glowFrag = `
precision highp float;
varying vec2 vUv;
void main(){
  float t = vUv.y;
  float side = smoothstep(0.0, 0.07, vUv.x) * smoothstep(1.0, 0.93, vUv.x);
  float g = pow(1.0 - t, 2.4);
  vec3 c = mix(vec3(0.42,0.52,0.72), vec3(0.88,0.93,1.0), pow(1.0 - t, 6.0));
  gl_FragColor = vec4(c * g * side, 1.0);
}`

function buildWall(mirror) {
  const geo = new CylinderGeometry(WALL_R, WALL_R, WALL_H, 160, 1, true, Math.PI - ARC / 2, ARC)
  geo.translate(0, WALL_H / 2, 0)
  const mat = new ShaderMaterial({
    vertexShader: wallVert, fragmentShader: wallFrag, side: DoubleSide, transparent: !!mirror,
    depthWrite: !mirror, uniforms: { uMirror: { value: mirror ? 1 : 0 }, uTime: { value: 0 } }
  })
  const m = new Mesh(geo, mat)
  m.position.set(0, 0, 3)
  if (mirror) m.scale.y = -1
  return m
}

export function mount(room) {
  const zoom = room.querySelector('.hj-room__zoom')
  if (!zoom || zoom.querySelector('.hj-3d')) return null
  let renderer
  try {
    renderer = new WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
  } catch (e) { return null }
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
  renderer.setPixelRatio(dpr)
  renderer.setClearColor(0x01040a, 1)
  const box = document.createElement('div')
  box.className = 'hj-3d'
  box.setAttribute('aria-hidden', 'true')
  const cv = renderer.domElement
  box.appendChild(cv)
  zoom.insertBefore(box, zoom.firstChild)
  room.classList.add('hj-has3d')

  const scene = new Scene()
  scene.background = radialTexture()

  const cam = new PerspectiveCamera(38, 16 / 9, 0.1, 200)
  const BASE = { x: 0, y: 1.5, z: 13 }
  const LOOK = { x: 0, y: 2.1, z: 0 }
  cam.position.set(BASE.x, BASE.y, BASE.z)
  cam.lookAt(LOOK.x, LOOK.y, LOOK.z)

  const world = new Group()
  scene.add(world)

  const wall = buildWall(false)
  const wallMirror = buildWall(true)
  world.add(wall, wallMirror)

  const gg = new CylinderGeometry(WALL_R, WALL_R, 1.7, 160, 1, true, Math.PI - ARC / 2, ARC)
  gg.translate(0, WALL_H + 0.85, 0)
  const glow = new Mesh(gg, new ShaderMaterial({
    vertexShader: wallVert, fragmentShader: glowFrag, side: DoubleSide, transparent: true,
    depthWrite: false, blending: AdditiveBlending
  }))
  glow.position.set(0, 0, 3)
  world.add(glow)

  const ledge = new Mesh(
    new CylinderGeometry(WALL_R - 0.05, WALL_R - 0.05, 0.22, 160, 1, true, Math.PI - ARC / 2, ARC),
    new MeshBasicMaterial({ color: 0x03070f, side: DoubleSide })
  )
  ledge.position.set(0, 0.11, 3)
  world.add(ledge)

  const floor = new Mesh(
    new RingGeometry(PIT_R, 70, 128, 1),
    new MeshBasicMaterial({ color: 0x020812, transparent: true, opacity: 0.3, side: DoubleSide, depthWrite: false })
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.set(0, 0, PIT_Z)
  world.add(floor)

  const sheen = new Mesh(
    new PlaneGeo(44, 44),
    new ShaderMaterial({
      vertexShader: `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: `
precision highp float;
varying vec3 vW;
float h(float x){ return fract(sin(x * 127.1) * 43758.5453); }
float n(float x){ float i = floor(x); float f = fract(x); f = f*f*(3.0-2.0*f); return mix(h(i), h(i+1.0), f); }
void main(){
  vec2 p = vW.xz - vec2(0.0, 3.0);
  float d = ${WALL_R.toFixed(1)} - length(p);
  float ang = abs(atan(p.x, -p.y));
  float side = smoothstep(1.12, 0.7, ang);
  float band = exp(-max(d, 0.0) * 0.17) * step(0.0, d);
  float wide = exp(-max(d, 0.0) * 0.09) * step(0.0, d);
  float st = 0.55 + 0.45 * n(vW.x * 5.0) * (0.6 + 0.4 * n(vW.x * 17.0 + 3.0));
  vec3 c = vec3(0.30, 0.40, 0.54) * band * st + vec3(0.11, 0.15, 0.22) * wide;
  gl_FragColor = vec4(c * side, 1.0);
}`,
      transparent: true, depthWrite: false, blending: AdditiveBlending
    })
  )
  sheen.rotation.x = -Math.PI / 2
  sheen.position.set(0, 0.012, 0)
  world.add(sheen)

  const pit = new Mesh(new CircleGeometry(PIT_R, 128), new MeshBasicMaterial({ color: 0x000206, transparent: true, opacity: 0.96 }))
  pit.rotation.x = -Math.PI / 2
  pit.position.set(0, 0.02, PIT_Z)
  world.add(pit)

  const rim = new Mesh(
    new TorusGeometry(PIT_R + 0.02, 0.018, 8, 160),
    new MeshBasicMaterial({ color: 0x0b1626 })
  )
  rim.rotation.x = Math.PI / 2
  rim.position.set(0, 0.03, PIT_Z)
  world.add(rim)

  const slot = new Group()
  slot.position.set(0, 0, PIT_Z)
  world.add(slot)

  let w = 0, h = 0
  function resize() {
    const r = box.getBoundingClientRect()
    const nw = Math.max(2, Math.round(r.width)), nh = Math.max(2, Math.round(r.height))
    if (nw === w && nh === h) return
    w = nw; h = nh
    renderer.setSize(w, h, false)
    cam.aspect = w / h
    cam.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(box)
  resize()

  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  let tx = 0, ty = 0, cx = 0, cy = 0, gx = 0, gy = 0
  function onMove(e) {
    tx = (e.clientX / window.innerWidth - 0.5) * 2
    ty = (e.clientY / window.innerHeight - 0.5) * 2
  }
  function onTilt(e) {
    if (e.gamma == null || e.beta == null) return
    gx = Math.max(-1, Math.min(1, e.gamma / 25))
    gy = Math.max(-1, Math.min(1, (e.beta - 55) / 25))
  }
  if (!RM) {
    if (FINE) window.addEventListener('pointermove', onMove, { passive: true })
    else window.addEventListener('deviceorientation', onTilt, { passive: true })
  }

  let raf = 0, t0 = performance.now(), running = false
  function frame(now) {
    raf = 0
    if (!running) return
    const t = (now - t0) / 1000
    const px = FINE ? tx : gx, py = FINE ? ty : gy
    cx += (px - cx) * 0.045
    cy += (py - cy) * 0.045
    const sway = RM ? 0 : Math.sin(t * 0.22) * 0.12
    cam.position.set(BASE.x + cx * 1.1 + sway, BASE.y - cy * 0.22, BASE.z)
    cam.lookAt(LOOK.x - cx * 0.35, LOOK.y + cy * 0.12, LOOK.z)
    wall.material.uniforms.uTime.value = Math.floor(t * 12) % 97
    wallMirror.material.uniforms.uTime.value = wall.material.uniforms.uTime.value
    renderer.render(scene, cam)
    raf = requestAnimationFrame(frame)
  }
  function sync() {
    const on = room.classList.contains('is-on') && !document.hidden
    if (on && !running) { running = true; resize(); if (!raf) raf = requestAnimationFrame(frame) }
    else if (!on && running) { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0 } }
  }
  const mo = new MutationObserver(sync)
  mo.observe(room, { attributes: true, attributeFilter: ['class'] })
  document.addEventListener('visibilitychange', sync)
  sync()
  function render() { renderer.render(scene, cam) }
  render()

  return {
    scene, camera: cam, slot, renderer,
    destroy() {
      running = false
      if (raf) cancelAnimationFrame(raf)
      mo.disconnect(); ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('deviceorientation', onTilt)
      document.removeEventListener('visibilitychange', sync)
      renderer.dispose(); box.remove(); room.classList.remove('hj-has3d')
    }
  }
}
