'use client'

import { useEffect, useRef } from 'react'

const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js'

type V3 = [number, number, number]

export default function HeroBike3D() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let animId = 0
    let renderer: any = null
    let destroyed = false
    const disposables: Array<() => void> = []

    function initScene() {
      if (destroyed || !mount) return
      const T = (window as any).THREE

      const w = mount.clientWidth  || 600
      const h = mount.clientHeight || 700

      // ── Scene & Camera ────────────────────────────────────
      const scene = new T.Scene()
      const cam   = new T.PerspectiveCamera(42, w / h, 0.1, 100)
      cam.position.set(0, 0.4, 4.4)
      cam.lookAt(0, 0.1, 0)

      // ── Renderer ──────────────────────────────────────────
      renderer = new T.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.domElement.style.cssText =
        'position:absolute;inset:0;width:100%;height:100%;display:block'
      mount.appendChild(renderer.domElement)

      // ── Lights ────────────────────────────────────────────
      scene.add(new T.AmbientLight(0xffffff, 0.30))

      const key = new T.DirectionalLight(0xffffff, 1.0)
      key.position.set(4, 7, 5)
      scene.add(key)

      const fill = new T.DirectionalLight(0xe8c547, 0.45)
      fill.position.set(-5, 2, -2)
      scene.add(fill)

      const back = new T.DirectionalLight(0xffffff, 0.20)
      back.position.set(0, -2, -5)
      scene.add(back)

      // ── Materials ─────────────────────────────────────────
      const mFrame  = new T.MeshPhongMaterial({ color: 0x1a1a1a, shininess: 80 })
      const mYellow = new T.MeshPhongMaterial({ color: 0xe8c547, shininess: 130, emissive: 0x1a1200 })
      const mGray   = new T.MeshPhongMaterial({ color: 0x2a2a2a, shininess: 45 })
      const mTire   = new T.MeshPhongMaterial({ color: 0x1e1e1e, shininess: 12 })
      const mRim    = new T.MeshPhongMaterial({ color: 0x303030, shininess: 90 })
      const mSaddle = new T.MeshPhongMaterial({ color: 0x111111, shininess: 22 })
      const mBat    = new T.MeshPhongMaterial({ color: 0x1a1a1a, shininess: 55 })
      const mMotor  = new T.MeshPhongMaterial({ color: 0x1f1f1f, shininess: 75 })

      // ── Bike group ────────────────────────────────────────
      const bike = new T.Group()
      scene.add(bike)

      // ── Helper: cylinder between two V3 points ────────────
      function cyl(p1: V3, p2: V3, r: number, mat: any, seg = 8) {
        const v1  = new T.Vector3(...p1)
        const v2  = new T.Vector3(...p2)
        const dir = new T.Vector3().subVectors(v2, v1)
        const len = dir.length()
        if (len < 0.001) return
        const geo  = new T.CylinderGeometry(r, r, len, seg, 1)
        const mesh = new T.Mesh(geo, mat)
        mesh.position.copy(new T.Vector3().lerpVectors(v1, v2, 0.5))
        mesh.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir.normalize())
        bike.add(mesh)
      }

      // ── Wheel builder ─────────────────────────────────────
      function makeWheel(wx: number) {
        const g = new T.Group()
        g.position.x = wx

        // Tire (outer)
        g.add(new T.Mesh(new T.TorusGeometry(0.50, 0.076, 18, 56), mTire))
        // Rim
        g.add(new T.Mesh(new T.TorusGeometry(0.44, 0.022, 10, 56), mRim))
        // Hub
        const hub = new T.Mesh(
          new T.CylinderGeometry(0.065, 0.065, 0.18, 12), mFrame
        )
        hub.rotation.x = Math.PI / 2
        g.add(hub)
        // Spokes ×9
        for (let i = 0; i < 9; i++) {
          const a = (i / 9) * Math.PI * 2
          const s = new T.Mesh(
            new T.CylinderGeometry(0.007, 0.007, 0.435, 4), mGray
          )
          s.rotation.z = a
          s.position.set(Math.cos(a) * 0.215, Math.sin(a) * 0.215, 0)
          g.add(s)
        }
        bike.add(g)
      }

      makeWheel(-0.92)  // rear
      makeWheel( 0.90)  // front

      // ── Frame key points ──────────────────────────────────
      //   Y-up, bike faces +X, wheel centres at y = 0
      const BB: V3 = [-0.10, -0.04,  0]   // bottom bracket
      const ST: V3 = [-0.33,  0.76,  0]   // seat tube top
      const HT: V3 = [ 0.61,  0.54,  0]   // head tube top
      const HB: V3 = [ 0.69,  0.13,  0]   // head tube bottom

      // Main triangle
      cyl(BB, ST, 0.030, mFrame)          // seat tube
      cyl(ST, HT, 0.026, mFrame)          // top tube
      cyl(HB, BB, 0.036, mFrame)          // down tube
      cyl(HT, HB, 0.034, mYellow)         // head tube – yellow accent

      // Chainstays (paired, z-offset)
      cyl([-0.92, 0,  0.08], [-0.10, -0.04,  0.08], 0.019, mFrame)
      cyl([-0.92, 0, -0.08], [-0.10, -0.04, -0.08], 0.019, mFrame)

      // Seatstays
      cyl([-0.92, 0,  0.07], [-0.34, 0.75,  0.04], 0.014, mFrame)
      cyl([-0.92, 0, -0.07], [-0.34, 0.75, -0.04], 0.014, mFrame)

      // ── Suspension fork ───────────────────────────────────
      // Upper stanchions (dark, narrow)
      cyl([0.69, 0.11, -0.07], [0.83, -0.20, -0.075], 0.022, mFrame)
      cyl([0.69, 0.11,  0.07], [0.83, -0.20,  0.075], 0.022, mFrame)
      // Lowers (wider, gray)
      cyl([0.83, -0.20, -0.075], [0.90, 0, -0.07], 0.027, mGray)
      cyl([0.83, -0.20,  0.075], [0.90, 0,  0.07], 0.027, mGray)
      // Fork crown brace
      const fc = new T.Mesh(new T.CylinderGeometry(0.030, 0.030, 0.18, 8), mFrame)
      fc.rotation.x = Math.PI / 2
      fc.position.set(0.69, 0.10, 0)
      bike.add(fc)

      // Axles (yellow through hubs)
      for (const ax of [-0.92, 0.90]) {
        const m = new T.Mesh(
          new T.CylinderGeometry(0.022, 0.022, 0.22, 8), mYellow
        )
        m.rotation.x = Math.PI / 2
        m.position.x = ax
        bike.add(m)
      }

      // ── Rear suspension shock ─────────────────────────────
      const shT: V3 = [-0.14,  0.47, 0]
      const shB: V3 = [-0.57,  0.15, 0]
      cyl(shT, shB, 0.028, mYellow)            // outer body (yellow)
      const shMid = new T.Vector3(...shT).lerp(new T.Vector3(...shB), 0.55)
      cyl([shMid.x, shMid.y, shMid.z], shB, 0.019, mFrame) // inner shaft
      // Mount spheres
      for (const p of [shT, shB]) {
        const s = new T.Mesh(new T.SphereGeometry(0.038, 8, 8), mYellow)
        s.position.set(...p)
        bike.add(s)
      }

      // ── Handlebar ─────────────────────────────────────────
      cyl(HT, [0.48, 0.80, 0], 0.020, mFrame)                       // stem
      cyl([0.48, 0.80, -0.38], [0.48, 0.80,  0.38], 0.018, mFrame)  // bar
      cyl([0.48, 0.80, -0.38], [0.46, 0.72, -0.36], 0.013, mFrame)  // sweep L
      cyl([0.48, 0.80,  0.38], [0.46, 0.72,  0.36], 0.013, mFrame)  // sweep R
      // Grips (yellow)
      for (const z of [-0.41, 0.41]) {
        const g = new T.Mesh(
          new T.CylinderGeometry(0.023, 0.023, 0.10, 8), mYellow
        )
        g.rotation.x = Math.PI / 2
        g.position.set(0.465, 0.755, z)
        bike.add(g)
      }
      // Stem clamp ring
      const sc = new T.Mesh(new T.CylinderGeometry(0.031, 0.031, 0.054, 10), mGray)
      sc.rotation.z = Math.PI / 2
      sc.position.set(0.62, 0.545, 0)
      bike.add(sc)

      // ── Saddle ────────────────────────────────────────────
      cyl(ST, [-0.34, 1.02, 0], 0.019, mFrame)   // seat post
      // Rails (thin rods under saddle)
      cyl([-0.19, 1.04, -0.04], [-0.55, 1.04, -0.04], 0.009, mGray)
      cyl([-0.19, 1.04,  0.04], [-0.55, 1.04,  0.04], 0.009, mGray)
      // Saddle shell
      const sad = new T.Mesh(new T.BoxGeometry(0.38, 0.055, 0.155), mSaddle)
      sad.position.set(-0.37, 1.072, 0)
      sad.rotation.z = 0.055
      bike.add(sad)

      // ── Motor (mid-drive ebike) ────────────────────────────
      const mot = new T.Mesh(new T.CylinderGeometry(0.094, 0.094, 0.22, 16), mMotor)
      mot.rotation.x = Math.PI / 2
      mot.position.set(-0.10, -0.04, 0)
      bike.add(mot)
      // Yellow stripe on motor
      const ms = new T.Mesh(new T.CylinderGeometry(0.095, 0.095, 0.024, 16), mYellow)
      ms.rotation.x = Math.PI / 2
      ms.position.set(-0.10, -0.04, 0)
      bike.add(ms)

      // ── Crankset ──────────────────────────────────────────
      // Chainring
      const cr = new T.Mesh(new T.TorusGeometry(0.13, 0.013, 8, 30), mYellow)
      cr.position.set(-0.10, -0.04, -0.115)
      bike.add(cr)
      // Cranks (180° apart)
      cyl([-0.10, -0.04, -0.115], [-0.10, -0.245, -0.115], 0.013, mFrame)
      cyl([-0.10, -0.04, -0.115], [-0.10,  0.165, -0.115], 0.013, mFrame)
      // Pedals
      for (const y of [-0.285, 0.205]) {
        const p = new T.Mesh(new T.BoxGeometry(0.095, 0.022, 0.068), mYellow)
        p.position.set(-0.10, y, -0.115)
        bike.add(p)
      }

      // ── Battery (on down tube) ────────────────────────────
      const batAngle = Math.atan2(HB[1] - BB[1], HB[0] - BB[0])
      const bat = new T.Mesh(new T.BoxGeometry(0.115, 0.38, 0.082), mBat)
      bat.position.set(0.27, 0.32, 0)
      bat.rotation.z = batAngle
      bike.add(bat)
      // Battery indicator strip
      const bs = new T.Mesh(new T.BoxGeometry(0.116, 0.024, 0.083), mYellow)
      bs.position.set(0.30, 0.49, 0)
      bs.rotation.z = batAngle
      bike.add(bs)

      // ── Initial pose ──────────────────────────────────────
      bike.rotation.y = Math.PI * 0.12

      // ── Animation loop ────────────────────────────────────
      let elapsed = 0
      let prevTime = performance.now()

      function loop() {
        if (destroyed) return
        animId = requestAnimationFrame(loop)
        const now = performance.now()
        elapsed += Math.min((now - prevTime) / 1000, 0.05)
        prevTime = now

        bike.rotation.y = Math.PI * 0.12 + elapsed * 0.36  // slow Y rotation
        bike.position.y  = Math.sin(elapsed * 0.85) * 0.07  // gentle float

        renderer.render(scene, cam)
      }
      loop()

      // ── Resize ────────────────────────────────────────────
      function onResize() {
        if (destroyed || !mount) return
        const nw = mount.clientWidth, nh = mount.clientHeight
        if (!nw || !nh) return
        cam.aspect = nw / nh
        cam.updateProjectionMatrix()
        renderer.setSize(nw, nh)
      }
      window.addEventListener('resize', onResize)
      disposables.push(() => window.removeEventListener('resize', onResize))
    }

    // ── Load Three.js from CDN, then init ─────────────────────
    if ((window as any).THREE) {
      initScene()
    } else {
      let script = document.getElementById('sb-three') as HTMLScriptElement | null
      if (!script) {
        script = document.createElement('script')
        script.id = 'sb-three'
        script.src = CDN
        script.crossOrigin = 'anonymous'
        document.head.appendChild(script)
      }
      script.addEventListener('load', initScene)
      disposables.push(() => script?.removeEventListener('load', initScene))
    }

    // ── Cleanup on unmount ────────────────────────────────────
    return () => {
      destroyed = true
      cancelAnimationFrame(animId)
      disposables.forEach(fn => fn())
      if (renderer) {
        try {
          if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
        } catch (_) {}
        renderer.dispose()
        renderer = null
      }
    }
  }, [])

  return <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />
}
