import {
  WebGLRenderer, Scene, PerspectiveCamera, Color, Group, Mesh, CylinderGeometry, CircleGeometry,
  RingGeometry, MeshBasicMaterial, TextureLoader, PlaneGeometry as PlaneGeo, ShaderMaterial, DoubleSide, BackSide, TorusGeometry, CanvasTexture,
  SRGBColorSpace, AdditiveBlending
} from 'three'

const WALL_R = 9
const WALL_H = 5.6
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
  float edge = smoothstep(0.0, 0.08, vUv.x) * smoothstep(1.0, 0.92, vUv.x);
  vec3 top = vec3(0.020, 0.052, 0.105);
  vec3 mid = vec3(0.045, 0.110, 0.205);
  vec3 low = vec3(0.250, 0.430, 0.700);
  vec3 hot = vec3(0.780, 0.880, 1.000);
  vec3 c = mix(mid, top, smoothstep(0.25, 1.0, v));
  float g1 = pow(1.0 - v, 3.2);
  float g2 = pow(1.0 - v, 9.0);
  float g3 = pow(1.0 - v, 26.0);
  float center = 0.72 + 0.28 * sin(vUv.x * 3.14159);
  c = mix(c, low, g1 * 0.62 * center);
  c = mix(c, hot, g2 * 0.55 * center);
  c += hot * g3 * 0.55 * center;
  c *= 0.55 + 0.45 * edge;
  c += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.018;
  float a = 1.0;
  if (uMirror > 0.5) {
    c *= 0.62;
    a = 1.0 - smoothstep(0.0, 0.85, v);
  }
  gl_FragColor = vec4(c, a);
}`

function radialTexture() {
  const c = document.createElement('canvas')
  c.width = 512; c.height = 288
  const x = c.getContext('2d')
  const g = x.createLinearGradient(0, 0, 0, 288)
  g.addColorStop(0, '#050d1e'); g.addColorStop(0.5, '#02060f'); g.addColorStop(1, '#010308')
  x.fillStyle = g; x.fillRect(0, 0, 512, 288)
  const r = x.createRadialGradient(256, 0, 0, 256, 0, 300)
  r.addColorStop(0, 'rgba(70,105,160,.22)'); r.addColorStop(1, 'rgba(70,105,160,0)')
  x.fillStyle = r; x.fillRect(0, 0, 512, 288)
  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  return t
}

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
  const LOOK = { x: 0, y: 1.5, z: 0 }
  cam.position.set(BASE.x, BASE.y, BASE.z)
  cam.lookAt(LOOK.x, LOOK.y, LOOK.z)

  const world = new Group()
  scene.add(world)

  const wall = buildWall(false)
  const wallMirror = buildWall(true)
  world.add(wall, wallMirror)

  const ledge = new Mesh(
    new CylinderGeometry(WALL_R - 0.05, WALL_R - 0.05, 0.22, 160, 1, true, Math.PI - ARC / 2, ARC),
    new MeshBasicMaterial({ color: 0x03070f, side: DoubleSide })
  )
  ledge.position.set(0, 0.11, 3)
  world.add(ledge)

  const floor = new Mesh(
    new RingGeometry(PIT_R, 70, 128, 1),
    new MeshBasicMaterial({ color: 0x020812, transparent: true, opacity: 0.56, side: DoubleSide, depthWrite: false })
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.set(0, 0, PIT_Z)
  world.add(floor)

  const sheen = new Mesh(
    new CircleGeometry(30, 96),
    new MeshBasicMaterial({ map: (() => {
      const c = document.createElement('canvas'); c.width = c.height = 256
      const x = c.getContext('2d'); const g = x.createRadialGradient(128, 128, 0, 128, 128, 128)
      g.addColorStop(0, 'rgba(90,130,200,.30)'); g.addColorStop(0.6, 'rgba(60,95,160,.10)'); g.addColorStop(1, 'rgba(0,0,0,0)')
      x.fillStyle = g; x.fillRect(0, 0, 256, 256)
      const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; return t
    })(), transparent: true, depthWrite: false, blending: AdditiveBlending })
  )
  sheen.rotation.x = -Math.PI / 2
  sheen.position.set(0, 0.012, 0)
  sheen.scale.set(1.5, 0.9, 1)
  world.add(sheen)

  const pit = new Mesh(new CircleGeometry(PIT_R, 128), new MeshBasicMaterial({ color: 0x00030a, transparent: true, opacity: 0.84 }))
  pit.rotation.x = -Math.PI / 2
  pit.position.set(0, 0.02, PIT_Z)
  world.add(pit)

  const rim = new Mesh(
    new TorusGeometry(PIT_R + 0.03, 0.035, 8, 160),
    new MeshBasicMaterial({ color: 0x1d2c44 })
  )
  rim.rotation.x = Math.PI / 2
  rim.position.set(0, 0.03, PIT_Z)
  world.add(rim)

  const slot = new Group()
  slot.position.set(0, 0, PIT_Z)
  world.add(slot)

  const CAM_W = 2.0, CAM_H = CAM_W * 1393 / 586, CAM_TOP = 2.7
  new TextureLoader().load('/hoj/camera.png?v=3', (tex) => {
    tex.colorSpace = SRGBColorSpace
    tex.anisotropy = 4
    const VIS = CAM_TOP + 0.4, frac = VIS / CAM_H
    tex.repeat.set(1, frac)
    tex.offset.set(0, 1 - frac)
    const body = new Mesh(
      new PlaneGeo(CAM_W, VIS),
      new MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.02, color: 0xe6edf8 })
    )
    body.position.set(0, CAM_TOP - VIS / 2, 0)
    slot.add(body)
    render()
  })

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
