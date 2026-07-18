import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Html, Billboard, useFBX } from "@react-three/drei";
import * as THREE from "three";

const FBX_URL = "/mannequin-3d/source/mannequin_stand.fbx";
const COLOR_TEX = "/mannequin-3d/textures/mannequin_color.png";
const STAND_TEX = "/mannequin-3d/textures/stand_color.png";
const STAND_ROUGH = "/mannequin-3d/textures/stand_roughness.png";

const TARGET_HEIGHT = 1.9; // world units to fit the whole model to
const REFERENCE_HEIGHT_CM = 170; // real-world height the fitted model represents
const CM_PER_UNIT = REFERENCE_HEIGHT_CM / TARGET_HEIGHT;

// Convert fitted world-unit dims to approximate real-world centimetres.
function toRealWorld(dims) {
  return {
    heightCm: dims.height * CM_PER_UNIT,
    widthCm: dims.width * CM_PER_UNIT,
    depthCm: dims.depth * CM_PER_UNIT,
  };
}

// Load a (possibly cross-origin) texture safely; returns null until ready.
// tile=true repeats the texture (embroidery); tile=false shows it once (dress).
function useSafeTexture(url, tile = true) {
  const [tex, setTex] = useState(null);
  useEffect(() => {
    if (!url) {
      setTex(null);
      return;
    }
    let alive = true;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      url,
      (t) => {
        if (!alive) return;
        if (tile) {
          t.wrapS = t.wrapT = THREE.RepeatWrapping;
          t.repeat.set(2, 2);
        } else {
          t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
        }
        t.colorSpace = THREE.SRGBColorSpace;
        setTex(t);
      },
      undefined,
      () => alive && setTex(null)
    );
    return () => {
      alive = false;
    };
  }, [url, tile]);
  return tex;
}

// Procedural fabric bump map: subtle woven-thread micro texture so garment
// materials read as cloth instead of smooth plastic. Cached across renders.
let _fabricBump = null;
function fabricBumpTexture() {
  if (_fabricBump) return _fabricBump;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, size, size);
  // fine warp/weft threads
  for (let i = 0; i < size; i += 2) {
    ctx.strokeStyle = i % 4 === 0 ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(10, 14);
  _fabricBump = tex;
  return tex;
}

// Top-edge height (as a fraction of the torso range) around the body, keyed by
// angle in degrees from the front centre. Captures a deep front V-neck, tall
// shoulder straps front & back, scooped armholes at the sides, and a higher
// straight back — i.e. a sleeveless V-neck crop blouse.
const NECK_CONTROLS = [
  [0, 0.5], // front centre = bottom of the V
  [30, 0.78], // front neckline rising
  [52, 1.0], // front shoulder strap (tallest)
  [90, 0.64], // underarm / armhole scoop
  [128, 0.98], // back shoulder strap
  [180, 0.92], // back neckline (high, near-straight)
];

function topFrac(deg) {
  const a = Math.abs(deg);
  for (let i = 0; i < NECK_CONTROLS.length - 1; i++) {
    const [d0, h0] = NECK_CONTROLS[i];
    const [d1, h1] = NECK_CONTROLS[i + 1];
    if (a >= d0 && a <= d1) {
      const t = (a - d0) / (d1 - d0);
      const s = 0.5 - 0.5 * Math.cos(Math.PI * t); // ease in/out
      return h0 + (h1 - h0) * s;
    }
  }
  return NECK_CONTROLS[NECK_CONTROLS.length - 1][1];
}

// Build a fitted, cropped, sleeveless V-neck blouse shell as a parametric mesh
// plus its top-edge (neckline + armhole) piping curve, and front button spots.
function buildBlouse(dims) {
  const top = dims.height;
  const rx = dims.width * 0.4; // ellipse half-width
  const rz = dims.depth * 0.3; // ellipse half-depth
  const waistY = top * 0.48; // cropped bottom
  const fullTopY = top * 0.86; // tallest edge (straps)

  const thetaSteps = 128;
  const vSteps = 30;
  const positions = [];
  const uvs = [];
  const indices = [];
  const topEdge = []; // ring of top vertices for the piping curve

  const radiusAt = (v) => 0.93 + 0.13 * v; // fitted at waist, fuller at bust

  for (let i = 0; i <= thetaSteps; i++) {
    const theta = (i / thetaSteps) * Math.PI * 2; // 0 = front centre (+Z)
    let deg = (theta * 180) / Math.PI;
    if (deg > 180) deg -= 360;
    const topY = waistY + topFrac(deg) * (fullTopY - waistY);
    const sinT = Math.sin(theta);
    const cosT = Math.cos(theta);
    const front = Math.max(0, cosT); // 1 at front centre, 0 at sides/back
    for (let j = 0; j <= vSteps; j++) {
      const v = j / vSteps;
      // rounded bust projection at the front, centred around chest height
      const bust = Math.exp(-Math.pow((v - 0.72) / 0.15, 2));
      const rs = radiusAt(v) + 0.12 * front * bust;
      const y = waistY + v * (topY - waistY);
      const x = rx * rs * sinT;
      const z = rz * rs * cosT;
      positions.push(x, y, z);
      uvs.push(i / thetaSteps, v);
      if (j === vSteps) topEdge.push(new THREE.Vector3(x, y, z));
    }
  }

  const rowLen = vSteps + 1;
  for (let i = 0; i < thetaSteps; i++) {
    for (let j = 0; j < vSteps; j++) {
      const a = i * rowLen + j;
      const b = (i + 1) * rowLen + j;
      const c = (i + 1) * rowLen + (j + 1);
      const d = i * rowLen + (j + 1);
      indices.push(a, b, d, b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();

  // Piping tube along the whole top edge.
  const curve = new THREE.CatmullRomCurve3(topEdge, true, "catmullrom", 0.2);
  const pipingGeo = new THREE.TubeGeometry(curve, 240, Math.min(rx, rz) * 0.05, 8, true);

  // Front button positions down the centre placket (theta = 0 → x = 0, +Z).
  const frontTopY = waistY + topFrac(0) * (fullTopY - waistY);
  const buttons = [];
  const n = 6;
  for (let k = 0; k < n; k++) {
    const y = frontTopY - 0.03 - (k / (n - 1)) * (frontTopY - waistY - 0.06);
    const v = (y - waistY) / (frontTopY - waistY);
    const bust = Math.exp(-Math.pow((v - 0.72) / 0.15, 2));
    const z = rz * (radiusAt(v) + 0.12 * bust) + Math.min(rx, rz) * 0.06;
    buttons.push([0, y, z]);
  }

  return { geo, pipingGeo, buttons, buttonR: Math.min(rx, rz) * 0.07 };
}

// A real 3D blouse (sleeveless, cropped, V-neck with piping + front buttons)
// that wraps the mannequin torso. Cloth colour is driven by `color`.
function Blouse({ dims, color = "#f2efe9" }) {
  const { geo, pipingGeo, buttons, buttonR } = useMemo(() => buildBlouse(dims), [dims]);
  const bump = useMemo(() => fabricBumpTexture(), []);

  const clothMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: 0.95,
        metalness: 0.0,
        side: THREE.DoubleSide,
        bumpMap: bump,
        bumpScale: 0.01,
      }),
    [color, bump]
  );

  // Piping/buttons: same hue, a touch smoother so edges catch the light.
  const trimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: 0.55,
        metalness: 0.05,
      }),
    [color]
  );
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(1, 16, 12), []);

  return (
    <group>
      <mesh geometry={geo} material={clothMat} castShadow />
      <mesh geometry={pipingGeo} material={trimMat} />
      {buttons.map((p, i) => (
        <mesh
          key={i}
          geometry={sphereGeo}
          material={trimMat}
          position={p}
          scale={[buttonR, buttonR, buttonR * 0.6]}
        />
      ))}
    </group>
  );
}

// The selected dress, shown as a camera-facing layer over the mannequin so it
// reads as "worn" from any orbit angle.
function DressLayer({ url, topY }) {
  const tex = useSafeTexture(url, false);
  if (!tex) return null;
  const img = tex.image || {};
  const aspect = img.width && img.height ? img.width / img.height : 1.2;
  const height = topY * 0.98;
  const width = height * aspect;
  return (
    <Billboard position={[0, topY * 0.52, 0]}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={tex} transparent alphaTest={0.4} side={THREE.DoubleSide} />
      </mesh>
    </Billboard>
  );
}

// Load + texture + auto-fit the downloaded FBX mannequin.
function useFittedMannequin() {
  const fbx = useFBX(FBX_URL);
  return useMemo(() => {
    const obj = fbx.clone(true);

    const loader = new THREE.TextureLoader();
    const bodyTex = loader.load(COLOR_TEX);
    bodyTex.flipY = false;
    bodyTex.colorSpace = THREE.SRGBColorSpace;
    const standTex = loader.load(STAND_TEX);
    standTex.flipY = false;
    standTex.colorSpace = THREE.SRGBColorSpace;
    const standRough = loader.load(STAND_ROUGH);
    standRough.flipY = false;

    obj.traverse((c) => {
      if (!c.isMesh) return;
      c.castShadow = true;
      c.receiveShadow = true;
      const name = (c.name + " " + (c.material?.name || "")).toLowerCase();
      const isStand = name.includes("stand") || name.includes("base") || name.includes("ground");
      c.material = new THREE.MeshStandardMaterial({
        map: isStand ? standTex : bodyTex,
        roughnessMap: isStand ? standRough : null,
        roughness: 0.85,
        metalness: 0.0,
      });
    });

    // Fit: scale so total height == TARGET_HEIGHT, feet at y = 0, centred in x/z.
    const box = new THREE.Box3().setFromObject(obj);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const scale = TARGET_HEIGHT / (size.y || 1);

    obj.scale.setScalar(scale);
    obj.position.set(
      -center.x * scale,
      -box.min.y * scale, // feet on the floor
      -center.z * scale
    );

    const dims = {
      height: size.y * scale,
      width: size.x * scale,
      depth: size.z * scale,
    };
    return { obj, dims };
  }, [fbx]);
}

// Neckline opening drawn as a flat skin-coloured shape at the chest.
function necklineShape(name) {
  const s = new THREE.Shape();
  switch (name) {
    case "V-Neck":
      s.moveTo(-0.1, 0.1);
      s.lineTo(0, -0.13);
      s.lineTo(0.1, 0.1);
      s.closePath();
      break;
    case "Square":
      s.moveTo(-0.1, 0.1);
      s.lineTo(-0.1, -0.07);
      s.lineTo(0.1, -0.07);
      s.lineTo(0.1, 0.1);
      s.closePath();
      break;
    case "Boat Neck":
      s.absellipse(0, 0.06, 0.14, 0.05, 0, Math.PI * 2);
      break;
    case "Sweetheart":
      s.moveTo(-0.1, 0.1);
      s.bezierCurveTo(-0.1, -0.02, -0.02, -0.02, 0, -0.1);
      s.bezierCurveTo(0.02, -0.02, 0.1, -0.02, 0.1, 0.1);
      s.closePath();
      break;
    case "Keyhole":
      s.absellipse(0, 0.05, 0.09, 0.08, 0, Math.PI * 2);
      break;
    default: // Round Neck
      s.absellipse(0, 0.04, 0.11, 0.1, 0, Math.PI * 2);
  }
  return s;
}

// Placement of the embroidery overlay on the fitted model, per zone.
function zonePlacement(zone, dims) {
  const top = dims.height; // feet at 0
  const frontZ = dims.depth / 2 + 0.02;
  const halfW = dims.width / 2;
  switch (zone) {
    case "zone-sleeve":
      return { position: [halfW * 0.9, top * 0.74, 0], rotation: [0, 0, -0.3], size: [0.16, 0.26] };
    case "zone-hem":
      return { position: [0, top * 0.35, frontZ], rotation: [0, 0, 0], size: [dims.width * 0.9, 0.14] };
    case "zone-back":
      return { position: [0, top * 0.78, -frontZ], rotation: [0, Math.PI, 0], size: [0.3, 0.3] };
    case "zone-border":
      return { position: [0, top * 0.86, frontZ], rotation: [0, 0, 0], size: [0.32, 0.07] };
    default: // zone-neckline
      return { position: [0, top * 0.8, frontZ], rotation: [0, 0, 0], size: [0.32, 0.22] };
  }
}

function Figure({ garmentType, neckline, embroideryImageUrl, activeZone, swatchColor, dressImageUrl, garmentColor, onMeasurements }) {
  const { obj, dims } = useFittedMannequin();
  const texture = useSafeTexture(embroideryImageUrl);
  const wearingDress = Boolean(dressImageUrl);

  // Report measurements (world units + real-world cm) once the model is fitted.
  useEffect(() => {
    if (!onMeasurements) return;
    onMeasurements({ ...dims, ...toRealWorld(dims) });
  }, [dims, onMeasurements]);

  const neckGeo = useMemo(() => new THREE.ShapeGeometry(necklineShape(neckline)), [neckline]);
  const place = zonePlacement(activeZone, dims);
  const top = dims.height;
  const frontZ = dims.depth / 2 + 0.02;

  return (
    <group>
      <primitive object={obj} />

      {/* Neckline shape near the collar (hidden while a full dress is worn) */}
      {!wearingDress && (
        <mesh geometry={neckGeo} position={[0, top * 0.88, frontZ]}>
          <meshStandardMaterial color="#e9dcc9" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Embroidery overlay on the active zone */}
      <mesh position={place.position} rotation={place.rotation} renderOrder={2}>
        <planeGeometry args={place.size} />
        {texture ? (
          <meshStandardMaterial map={texture} transparent opacity={0.97} side={THREE.DoubleSide} />
        ) : (
          <meshStandardMaterial
            color={swatchColor || "#d4af37"}
            metalness={0.4}
            roughness={0.5}
            side={THREE.DoubleSide}
          />
        )}
      </mesh>

      {/* Selected dress worn on the mannequin */}
      <DressLayer url={dressImageUrl} topY={top} />
    </group>
  );
}

export default function Mannequin3D({
  garmentType = "Blouse",
  neckline = "Round Neck",
  embroideryImageUrl = "",
  activeZone = "zone-neckline",
  swatchColor = "",
  dressImageUrl = "",
  garmentColor = "",
  onMeasurements,
}) {
  return (
    <Canvas shadows camera={{ position: [0, 1.2, 3.4], fov: 42 }} style={{ width: "100%", height: "100%" }}>
      <color attach="background" args={["#faf6ef"]} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 6, 4]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-3, 3, -2]} intensity={0.45} />
      <Suspense
        fallback={
          <Html center>
            <span style={{ color: "#a01c3e", fontSize: 13 }}>Loading 3D mannequin…</span>
          </Html>
        }
      >
        <Figure
          garmentType={garmentType}
          neckline={neckline}
          embroideryImageUrl={embroideryImageUrl}
          activeZone={activeZone}
          swatchColor={swatchColor}
          dressImageUrl={dressImageUrl}
          garmentColor={garmentColor}
          onMeasurements={onMeasurements}
        />
        <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={5} blur={2.4} far={3} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        minDistance={1.4}
        maxDistance={6}
        target={[0, 1.1, 0]}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  );
}
