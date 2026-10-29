import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Eye,
  Sliders,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { horologySound } from '../utils/soundEngine';

export type MaterialFinish = 'rose-gold' | 'titanium' | 'platinum' | 'forged-carbon';

export type CameraViewPreset = 'front' | 'angle' | 'tourbillon' | 'side' | 'caseback';

interface Watch3DViewerProps {
  finish?: MaterialFinish;
  onFinishChange?: (finish: MaterialFinish) => void;
  explodedAmount?: number;
  onExplodedChange?: (amount: number) => void;
  className?: string;
}

interface Hotspot {
  id: string;
  name: string;
  desc: string;
  position: THREE.Vector3;
  screenPos: { x: number; y: number; visible: boolean };
}

export const Watch3DViewer: React.FC<Watch3DViewerProps> = ({
  finish: externalFinish = 'rose-gold',
  onFinishChange,
  explodedAmount: externalExploded = 0,
  onExplodedChange,
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // UI state
  const [finish, setFinish] = useState<MaterialFinish>(externalFinish);
  const [exploded, setExploded] = useState<number>(externalExploded);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<CameraViewPreset>('angle');
  const [hudCollapsed, setHudCollapsed] = useState<boolean>(false);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Sync external props
  useEffect(() => {
    setFinish(externalFinish);
  }, [externalFinish]);

  useEffect(() => {
    setExploded(externalExploded);
  }, [externalExploded]);

  // Three.js mutable state refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const watchGroupRef = useRef<THREE.Group | null>(null);

  // Specific watch layers for exploded view
  const crystalMeshRef = useRef<THREE.Mesh | null>(null);
  const bezelGroupRef = useRef<THREE.Group | null>(null);
  const dialGroupRef = useRef<THREE.Group | null>(null);
  const handsGroupRef = useRef<THREE.Group | null>(null);
  const tourbillonGroupRef = useRef<THREE.Group | null>(null);
  const balanceWheelRef = useRef<THREE.Mesh | null>(null);
  const secondsHandRef = useRef<THREE.Mesh | null>(null);
  const minutesHandRef = useRef<THREE.Mesh | null>(null);
  const hoursHandRef = useRef<THREE.Mesh | null>(null);
  const caseGroupRef = useRef<THREE.Group | null>(null);
  const rotorGroupRef = useRef<THREE.Group | null>(null);
  const casebackGroupRef = useRef<THREE.Group | null>(null);

  // Materials map for dynamic color/metal swaps
  const materialsRef = useRef<{
    caseMat: THREE.MeshPhysicalMaterial;
    bezelMat: THREE.MeshPhysicalMaterial;
    accentMat: THREE.MeshPhysicalMaterial;
    dialMat: THREE.MeshStandardMaterial;
    screwsMat: THREE.MeshPhysicalMaterial;
    crystalMat: THREE.MeshPhysicalMaterial;
    rotorMat: THREE.MeshPhysicalMaterial;
    gearsMat: THREE.MeshPhysicalMaterial;
    jewelsMat: THREE.MeshPhysicalMaterial;
    handsMat: THREE.MeshPhysicalMaterial;
  } | null>(null);

  // Camera targets for smooth damping
  const cameraTargetPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.4, 5.2));
  const cameraTargetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentCameraLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // User manual rotation state
  const isDragging = useRef<boolean>(false);
  const prevMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationVelocity = useRef<{ x: number; y: number }>({ x: 0, y: 0.003 });

  // Update finish materials
  const applyMaterialFinish = useCallback((f: MaterialFinish) => {
    if (!materialsRef.current) return;
    const mats = materialsRef.current;

    switch (f) {
      case 'rose-gold':
        mats.caseMat.color.setHex(0xd4a373);
        mats.caseMat.roughness = 0.22;
        mats.caseMat.metalness = 0.95;

        mats.bezelMat.color.setHex(0xe0b589);
        mats.bezelMat.roughness = 0.18;
        mats.bezelMat.metalness = 0.98;

        mats.dialMat.color.setHex(0x12141a);
        mats.accentMat.color.setHex(0xd4af37);
        mats.handsMat.color.setHex(0xf5d77f);
        mats.rotorMat.color.setHex(0xcca050);
        mats.screwsMat.color.setHex(0x2d4f8f); // Blued steel screws
        break;

      case 'titanium':
        mats.caseMat.color.setHex(0x717782);
        mats.caseMat.roughness = 0.35;
        mats.caseMat.metalness = 0.88;

        mats.bezelMat.color.setHex(0x565c66);
        mats.bezelMat.roughness = 0.28;
        mats.bezelMat.metalness = 0.92;

        mats.dialMat.color.setHex(0x1c1f24);
        mats.accentMat.color.setHex(0xd9534f); // Crimson red accent
        mats.handsMat.color.setHex(0xdfe3e8);
        mats.rotorMat.color.setHex(0x8a929e);
        mats.screwsMat.color.setHex(0x474e59);
        break;

      case 'platinum':
        mats.caseMat.color.setHex(0xdde3ea);
        mats.caseMat.roughness = 0.15;
        mats.caseMat.metalness = 0.98;

        mats.bezelMat.color.setHex(0xf0f4f8);
        mats.bezelMat.roughness = 0.12;
        mats.bezelMat.metalness = 0.99;

        mats.dialMat.color.setHex(0x0a1931); // Midnight Royal Azure Blue
        mats.accentMat.color.setHex(0x64b5f6);
        mats.handsMat.color.setHex(0xffffff);
        mats.rotorMat.color.setHex(0xc5d1de);
        mats.screwsMat.color.setHex(0x1d3557);
        break;

      case 'forged-carbon':
        mats.caseMat.color.setHex(0x222428);
        mats.caseMat.roughness = 0.65;
        mats.caseMat.metalness = 0.35;

        mats.bezelMat.color.setHex(0x181a1d);
        mats.bezelMat.roughness = 0.7;
        mats.bezelMat.metalness = 0.2;

        mats.dialMat.color.setHex(0x0f1412);
        mats.accentMat.color.setHex(0x2ec4b6); // Emerald turquoise
        mats.handsMat.color.setHex(0x48cae4);
        mats.rotorMat.color.setHex(0x2b2e36);
        mats.screwsMat.color.setHex(0x000000);
        break;
    }
  }, []);

  // Set Camera View Preset
  const setCameraPreset = (preset: CameraViewPreset) => {
    setActivePreset(preset);
    horologySound.playMetallicClick();

    switch (preset) {
      case 'front':
        cameraTargetPos.current.set(0, 0, 4.3);
        cameraTargetLookAt.current.set(0, 0, 0);
        break;
      case 'angle':
        cameraTargetPos.current.set(2.0, 1.4, 4.2);
        cameraTargetLookAt.current.set(0, 0, 0);
        break;
      case 'tourbillon':
        cameraTargetPos.current.set(0, -0.7, 2.3);
        cameraTargetLookAt.current.set(0, -0.55, 0.2);
        break;
      case 'side':
        cameraTargetPos.current.set(4.2, 0.2, 1.2);
        cameraTargetLookAt.current.set(0, 0, 0);
        break;
      case 'caseback':
        cameraTargetPos.current.set(0, 0.2, -4.5);
        cameraTargetLookAt.current.set(0, 0, 0);
        break;
    }
  };

  const handleFinishSelect = (f: MaterialFinish) => {
    setFinish(f);
    applyMaterialFinish(f);
    horologySound.playMetallicClick();
    if (onFinishChange) onFinishChange(f);
  };

  const handleExplodedSlider = (val: number) => {
    setExploded(val);
    if (onExplodedChange) onExplodedChange(val);
  };

  const toggleSound = () => {
    const newState = horologySound.toggleTicking();
    setSoundEnabled(newState);
  };

  const toggleFullscreen = () => {
    if (!mountRef.current?.parentElement) return;
    if (!document.fullscreenElement) {
      mountRef.current.parentElement.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Three.js Mount & Animation Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL as per threejs guidelines
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x08090c);
    scene.fog = new THREE.FogExp2(0x08090c, 0.08);

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.copy(cameraTargetPos.current);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment lighting via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Key Light
    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.2);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    // Rim Light (cool blue reflection)
    const rimLight = new THREE.DirectionalLight(0x88bbff, 1.8);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    // Under-dial warmth
    const fillLight = new THREE.PointLight(0xffd599, 1.2, 8);
    fillLight.position.set(0, -2, 3);
    scene.add(fillLight);

    // Hemisphere Light
    const hemiLight = new THREE.HemisphereLight(0x223344, 0x111118, 0.8);
    scene.add(hemiLight);

    // Contact shadow ground plane
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext('2d')!;
    const gradient = shadowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    shadowCtx.fillStyle = gradient;
    shadowCtx.fillRect(0, 0, 128, 128);
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);

    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.6,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.position.y = -2.1;
    shadowPlane.rotation.x = -Math.PI / 2;
    scene.add(shadowPlane);

    // Procedural Dial Texture (Sunray Guilloché & Rail Tracks)
    const dialCanvas = document.createElement('canvas');
    dialCanvas.width = 1024;
    dialCanvas.height = 1024;
    const ctx = dialCanvas.getContext('2d')!;
    const cx = 512;
    const cy = 512;

    // Dark dial plate with Côtes de Genève / Guilloché radial pattern
    ctx.fillStyle = '#0f1115';
    ctx.fillRect(0, 0, 1024, 1024);

    // Radial sunburst lines
    ctx.save();
    ctx.translate(cx, cy);
    for (let i = 0; i < 360; i += 1.5) {
      ctx.rotate((1.5 * Math.PI) / 180);
      ctx.strokeStyle = i % 15 === 0 ? 'rgba(212, 175, 55, 0.28)' : 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = i % 15 === 0 ? 1.5 : 0.75;
      ctx.beginPath();
      ctx.moveTo(0, 110);
      ctx.lineTo(0, 480);
      ctx.stroke();
    }
    ctx.restore();

    // Concentric minute track rings
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 470, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 440, 0, Math.PI * 2);
    ctx.stroke();

    // 60-minute tick markings
    for (let m = 0; m < 60; m++) {
      const angle = (m * Math.PI) / 30;
      const isFive = m % 5 === 0;
      const rInner = isFive ? 435 : 448;
      const rOuter = 465;
      const x1 = cx + Math.sin(angle) * rInner;
      const y1 = cy - Math.cos(angle) * rInner;
      const x2 = cx + Math.sin(angle) * rOuter;
      const y2 = cy - Math.cos(angle) * rOuter;

      ctx.strokeStyle = isFive ? '#d4af37' : 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = isFive ? 3.5 : 1.5;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Brand inscription
    ctx.fillStyle = '#d4af37';
    ctx.font = '600 24px "Cinzel", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('AETHEL·GARD', cx, cy - 220);

    ctx.font = '400 13px "Space Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.fillText('HAUTE HORLOGERIE — GENÈVE', cx, cy - 195);
    ctx.fillText('TOURBILLON 60S', cx, cy - 175);

    // Tourbillon aperture cutout indicator at 6 o'clock
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy + 200, 160, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#060709';
    ctx.beginPath();
    ctx.arc(cx, cy + 200, 155, 0, Math.PI * 2);
    ctx.fill();

    const dialTexture = new THREE.CanvasTexture(dialCanvas);
    dialTexture.colorSpace = THREE.SRGBColorSpace;
    dialTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Materials Initialization
    const materials = {
      caseMat: new THREE.MeshPhysicalMaterial({
        color: 0xd4a373,
        metalness: 0.95,
        roughness: 0.22,
        clearcoat: 0.4,
        clearcoatRoughness: 0.15,
      }),
      bezelMat: new THREE.MeshPhysicalMaterial({
        color: 0xe0b589,
        metalness: 0.98,
        roughness: 0.18,
      }),
      accentMat: new THREE.MeshPhysicalMaterial({
        color: 0xd4af37,
        metalness: 0.9,
        roughness: 0.2,
      }),
      dialMat: new THREE.MeshStandardMaterial({
        map: dialTexture,
        metalness: 0.4,
        roughness: 0.35,
      }),
      screwsMat: new THREE.MeshPhysicalMaterial({
        color: 0x2d4f8f,
        metalness: 0.95,
        roughness: 0.1,
      }),
      crystalMat: new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.05,
        roughness: 0.05,
        transmission: isSoftwareGl ? 0 : 0.92,
        transparent: true,
        opacity: isSoftwareGl ? 0.35 : 1.0,
        ior: 1.77, // Sapphire glass index of refraction
        thickness: 0.8,
        attenuationColor: new THREE.Color(0xddeeff),
        depthWrite: false,
      }),
      rotorMat: new THREE.MeshPhysicalMaterial({
        color: 0xcca050,
        metalness: 0.95,
        roughness: 0.25,
      }),
      gearsMat: new THREE.MeshPhysicalMaterial({
        color: 0xe6b865,
        metalness: 0.92,
        roughness: 0.18,
      }),
      jewelsMat: new THREE.MeshPhysicalMaterial({
        color: 0xd90429, // Synthetic ruby jewel
        metalness: 0.1,
        roughness: 0.05,
        transmission: isSoftwareGl ? 0 : 0.85,
        transparent: true,
        opacity: isSoftwareGl ? 0.8 : 1.0,
      }),
      handsMat: new THREE.MeshPhysicalMaterial({
        color: 0xf5d77f,
        metalness: 0.98,
        roughness: 0.1,
      }),
    };
    materialsRef.current = materials;

    // BUILD PROCEDURAL HAUTE HORLOGERIE WATCH (Multi-part THREE.Group)
    const masterWatch = new THREE.Group();
    watchGroupRef.current = masterWatch;
    scene.add(masterWatch);

    // ==========================================
    // LAYER 1: SAPPHIRE CRYSTAL (Glass front)
    // ==========================================
    const crystalGeo = new THREE.CylinderGeometry(1.92, 1.94, 0.08, 64);
    const crystalMesh = new THREE.Mesh(crystalGeo, materials.crystalMat);
    crystalMesh.rotation.x = Math.PI / 2;
    crystalMesh.position.z = 0.24;
    crystalMeshRef.current = crystalMesh;
    masterWatch.add(crystalMesh);

    // ==========================================
    // LAYER 2: BEZEL & BEZEL SCREWS
    // ==========================================
    const bezelGroup = new THREE.Group();
    bezelGroupRef.current = bezelGroup;
    masterWatch.add(bezelGroup);

    // Octagonal beveled luxury bezel ring
    const bezelGeo = new THREE.TorusGeometry(1.92, 0.18, 16, 64);
    const bezelMesh = new THREE.Mesh(bezelGeo, materials.bezelMat);
    bezelMesh.castShadow = !isSoftwareGl;
    bezelMesh.receiveShadow = !isSoftwareGl;
    bezelGroup.add(bezelMesh);

    // Outer octagonal chamfer accent
    const outerBezelGeo = new THREE.RingGeometry(1.95, 2.15, 8);
    const outerBezelMesh = new THREE.Mesh(outerBezelGeo, materials.bezelMat);
    outerBezelMesh.position.z = -0.02;
    bezelGroup.add(outerBezelMesh);

    // 8 Hex Bezel Screws
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8 + Math.PI / 8;
      const screwGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.08, 16);
      const screwMesh = new THREE.Mesh(screwGeo, materials.screwsMat);
      screwMesh.rotation.x = Math.PI / 2;
      screwMesh.position.set(Math.cos(angle) * 1.98, Math.sin(angle) * 1.98, 0.05);
      bezelGroup.add(screwMesh);
    }

    // ==========================================
    // LAYER 3: WATCH HANDS & CHAPTER RING
    // ==========================================
    const handsGroup = new THREE.Group();
    handsGroupRef.current = handsGroup;
    handsGroup.position.z = 0.14;
    masterWatch.add(handsGroup);

    // Center jewel cap
    const centerCapGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.08, 32);
    const centerCap = new THREE.Mesh(centerCapGeo, materials.jewelsMat);
    centerCap.rotation.x = Math.PI / 2;
    handsGroup.add(centerCap);

    // Hour Hand (Faceted Dauphine design)
    const hourHandGeo = new THREE.ConeGeometry(0.08, 0.85, 4);
    const hourHand = new THREE.Mesh(hourHandGeo, materials.handsMat);
    hourHand.position.y = 0.42;
    const hourPivot = new THREE.Group();
    hourPivot.add(hourHand);
    hoursHandRef.current = hourPivot as unknown as THREE.Mesh;
    handsGroup.add(hourPivot);

    // Minute Hand (Longer faceted Dauphine)
    const minuteHandGeo = new THREE.ConeGeometry(0.065, 1.35, 4);
    const minuteHand = new THREE.Mesh(minuteHandGeo, materials.handsMat);
    minuteHand.position.y = 0.65;
    const minutePivot = new THREE.Group();
    minutePivot.add(minuteHand);
    minutesHandRef.current = minutePivot as unknown as THREE.Mesh;
    handsGroup.add(minutePivot);

    // Seconds Hand (Ultra-fine blued steel needle with counterweight)
    const secNeedleGeo = new THREE.CylinderGeometry(0.015, 0.01, 1.5, 8);
    const secNeedle = new THREE.Mesh(secNeedleGeo, materials.screwsMat);
    secNeedle.position.y = 0.55;

    const secCounterGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.35, 16);
    const secCounter = new THREE.Mesh(secCounterGeo, materials.screwsMat);
    secCounter.position.y = -0.18;

    const secPivot = new THREE.Group();
    secPivot.add(secNeedle);
    secPivot.add(secCounter);
    secPivot.position.z = 0.03;
    secondsHandRef.current = secPivot as unknown as THREE.Mesh;
    handsGroup.add(secPivot);

    // ==========================================
    // LAYER 4: SKELETON DIAL & EXPOSED BRIDGES
    // ==========================================
    const dialGroup = new THREE.Group();
    dialGroupRef.current = dialGroup;
    dialGroup.position.z = 0.06;
    masterWatch.add(dialGroup);

    // Dial face disc
    const dialPlateGeo = new THREE.CircleGeometry(1.88, 64);
    const dialPlate = new THREE.Mesh(dialPlateGeo, materials.dialMat);
    dialPlate.receiveShadow = !isSoftwareGl;
    dialGroup.add(dialPlate);

    // 12 Applied Gold Hour Index Markers
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12;
      const isTwelve = i === 0;
      const markerGeo = new THREE.BoxGeometry(isTwelve ? 0.12 : 0.07, isTwelve ? 0.32 : 0.24, 0.06);
      const marker = new THREE.Mesh(markerGeo, materials.accentMat);
      marker.position.set(Math.sin(angle) * 1.52, Math.cos(angle) * 1.52, 0.03);
      marker.rotation.z = -angle;
      dialGroup.add(marker);
    }

    // ==========================================
    // LAYER 5: LIVE TOURBILLON CARRIAGE & BALANCE WHEEL
    // ==========================================
    const tourbillonGroup = new THREE.Group();
    tourbillonGroupRef.current = tourbillonGroup;
    tourbillonGroup.position.set(0, -0.75, 0.02);
    masterWatch.add(tourbillonGroup);

    // Outer polished Tourbillon Bridge
    const bridgeGeo = new THREE.BoxGeometry(0.85, 0.09, 0.06);
    const bridgeMesh = new THREE.Mesh(bridgeGeo, materials.accentMat);
    bridgeMesh.position.z = 0.05;
    tourbillonGroup.add(bridgeMesh);

    // Rotating carriage container (rotates 1 full turn every 60s)
    const rotatingCage = new THREE.Group();
    tourbillonGroup.add(rotatingCage);

    // Lyre-shaped Tourbillon Cage frame
    const cageRingGeo = new THREE.TorusGeometry(0.42, 0.035, 12, 32);
    const cageRing = new THREE.Mesh(cageRingGeo, materials.accentMat);
    rotatingCage.add(cageRing);

    // Three curved cage arms
    for (let a = 0; a < 3; a++) {
      const armGeo = new THREE.BoxGeometry(0.04, 0.42, 0.02);
      const arm = new THREE.Mesh(armGeo, materials.accentMat);
      arm.rotation.z = (a * Math.PI * 2) / 3;
      arm.position.z = 0.02;
      rotatingCage.add(arm);
    }

    // Escapement wheel with teeth
    const escapeWheelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.03, 15);
    const escapeWheel = new THREE.Mesh(escapeWheelGeo, materials.gearsMat);
    escapeWheel.rotation.x = Math.PI / 2;
    escapeWheel.position.set(0.18, 0, -0.02);
    rotatingCage.add(escapeWheel);

    // Free-sprung balance wheel with inertia screws
    const balanceGeo = new THREE.TorusGeometry(0.36, 0.03, 12, 32);
    const balanceWheel = new THREE.Mesh(balanceGeo, materials.gearsMat);
    balanceWheelRef.current = balanceWheel;
    rotatingCage.add(balanceWheel);

    // 4 Gold inertia regulating screws on balance rim
    for (let s = 0; s < 4; s++) {
      const sAngle = (s * Math.PI) / 2;
      const bScrewGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.05, 8);
      const bScrew = new THREE.Mesh(bScrewGeo, materials.accentMat);
      bScrew.position.set(Math.cos(sAngle) * 0.38, Math.sin(sAngle) * 0.38, 0);
      balanceWheel.add(bScrew);
    }

    // Central ruby endstone
    const rubyEndstoneGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16);
    const rubyEndstone = new THREE.Mesh(rubyEndstoneGeo, materials.jewelsMat);
    rubyEndstone.rotation.x = Math.PI / 2;
    rubyEndstone.position.z = 0.04;
    rotatingCage.add(rubyEndstone);

    // ==========================================
    // LAYER 6: CASE MIDDLE, LUGS, CROWN & STRAP
    // ==========================================
    const caseGroup = new THREE.Group();
    caseGroupRef.current = caseGroup;
    masterWatch.add(caseGroup);

    // Main central case cylinder
    const caseCylinderGeo = new THREE.CylinderGeometry(2.1, 2.05, 0.35, 64);
    const caseCylinder = new THREE.Mesh(caseCylinderGeo, materials.caseMat);
    caseCylinder.rotation.x = Math.PI / 2;
    caseCylinder.position.z = -0.15;
    caseCylinder.castShadow = !isSoftwareGl;
    caseGroup.add(caseCylinder);

    // 4 Sculpted Lugs for strap attachment
    const lugPositions = [
      [-1.4, 2.1, -0.15],
      [1.4, 2.1, -0.15],
      [-1.4, -2.1, -0.15],
      [1.4, -2.1, -0.15],
    ];
    lugPositions.forEach(([lx, ly, lz]) => {
      const lugGeo = new THREE.BoxGeometry(0.42, 0.9, 0.32);
      const lug = new THREE.Mesh(lugGeo, materials.caseMat);
      lug.position.set(lx, ly, lz);
      lug.rotation.z = lx > 0 ? (ly > 0 ? -0.2 : 0.2) : ly > 0 ? 0.2 : -0.2;
      caseGroup.add(lug);
    });

    // Winding Crown at 3 o'clock
    const crownGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.28, 24);
    const crown = new THREE.Mesh(crownGeo, materials.accentMat);
    crown.rotation.z = Math.PI / 2;
    crown.position.set(2.28, 0, -0.15);
    caseGroup.add(crown);

    // Alligator Leather Straps (Upper and Lower)
    const strapMat = new THREE.MeshStandardMaterial({
      color: 0x141416,
      roughness: 0.85,
      metalness: 0.1,
    });
    const strapGeo = new THREE.BoxGeometry(1.9, 2.4, 0.18);

    const topStrap = new THREE.Mesh(strapGeo, strapMat);
    topStrap.position.set(0, 3.1, -0.26);
    caseGroup.add(topStrap);

    const bottomStrap = new THREE.Mesh(strapGeo, strapMat);
    bottomStrap.position.set(0, -3.1, -0.26);
    caseGroup.add(bottomStrap);

    // ==========================================
    // LAYER 7: 22K GOLD OSCILLATING ROTOR (Self-winding)
    // ==========================================
    const rotorGroup = new THREE.Group();
    rotorGroupRef.current = rotorGroup;
    rotorGroup.position.z = -0.32;
    masterWatch.add(rotorGroup);

    // Semi-circular weighted oscillating weight
    const rotorGeo = new THREE.RingGeometry(0.45, 1.85, 32, 1, 0, Math.PI);
    const rotorMesh = new THREE.Mesh(rotorGeo, materials.rotorMat);
    rotorMesh.rotation.z = Math.PI / 4;
    rotorGroup.add(rotorMesh);

    // Rotor ball bearing hub
    const rotorHubGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 32);
    const rotorHub = new THREE.Mesh(rotorHubGeo, materials.accentMat);
    rotorHub.rotation.x = Math.PI / 2;
    rotorGroup.add(rotorHub);

    // ==========================================
    // LAYER 8: EXHIBITION CASEBACK GLASS & RIM
    // ==========================================
    const casebackGroup = new THREE.Group();
    casebackGroupRef.current = casebackGroup;
    casebackGroup.position.z = -0.42;
    masterWatch.add(casebackGroup);

    const backGlassGeo = new THREE.CircleGeometry(1.65, 48);
    const backGlass = new THREE.Mesh(backGlassGeo, materials.crystalMat);
    backGlass.rotation.y = Math.PI;
    casebackGroup.add(backGlass);

    const backRimGeo = new THREE.RingGeometry(1.6, 2.05, 48);
    const backRim = new THREE.Mesh(backRimGeo, materials.caseMat);
    backRim.rotation.y = Math.PI;
    casebackGroup.add(backRim);

    // Pre-warm compile as per skill
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Set initial finish
    applyMaterialFinish(finish);

    // HOTSPOTS DEFINITIONS (Interactive 3D points)
    const initialHotspots: Hotspot[] = [
      {
        id: 'tourbillon',
        name: 'Uçan Tourbillon Kafesi',
        desc: 'Yerçekiminin salınım üzerindeki etkisini sıfırlayan, dakikada 1 tam tur dönen titanyum kafesli başyapıt.',
        position: new THREE.Vector3(0, -0.75, 0.25),
        screenPos: { x: 0, y: 0, visible: false },
      },
      {
        id: 'sapphire',
        name: 'Çift Kubbeli Safir Kristal',
        desc: 'Mohs sertlik skalasında 9 derece. Çift taraflı 7 katmanlı anti-refleks kaplama ile sıfır parlama.',
        position: new THREE.Vector3(0, 0.9, 0.35),
        screenPos: { x: 0, y: 0, visible: false },
      },
      {
        id: 'crown',
        name: 'Vidalı Tepe & 50M Yalıtım',
        desc: 'O-ring çift contalı, kabartma Aethelgard monogramlı 18k masif altın kurma tepesi.',
        position: new THREE.Vector3(2.35, 0, -0.15),
        screenPos: { x: 0, y: 0, visible: false },
      },
      {
        id: 'rotor',
        name: '22K Masif Altın Rotor',
        desc: 'Her bilek hareketiyle çift yöne kurulan, Côtes de Genève el işlemesi 22 ayar altın ağırlık.',
        position: new THREE.Vector3(-0.9, -0.4, -0.45),
        screenPos: { x: 0, y: 0, visible: false },
      },
    ];
    setHotspots(initialHotspots);

    // ANIMATION & RENDER LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let balanceOscillation = 0;
    let rotorMomentum = 0;

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth camera interpolation (exponential damping)
      camera.position.lerp(cameraTargetPos.current, 0.06);
      currentCameraLookAt.current.lerp(cameraTargetLookAt.current, 0.06);
      camera.lookAt(currentCameraLookAt.current);

      // Auto rotation when not dragging
      if (masterWatch) {
        if (!isDragging.current && autoRotate) {
          masterWatch.rotation.y += 0.004;
        } else if (!isDragging.current) {
          // Inertial damping
          masterWatch.rotation.y += rotationVelocity.current.y;
          masterWatch.rotation.x += rotationVelocity.current.x;
          rotationVelocity.current.y *= 0.94;
          rotationVelocity.current.x *= 0.94;
        }
      }

      // 1. Tourbillon continuous rotation (60s cycle = 1 rev/min)
      if (rotatingCage) {
        rotatingCage.rotation.z += (Math.PI * 2 * delta) / 15; // accelerated demo speed
      }

      // 2. Balance wheel rapid oscillation (4Hz / 28,800 vph tick)
      if (balanceWheelRef.current) {
        balanceOscillation += delta * 25.13; // 4Hz angular frequency
        balanceWheelRef.current.rotation.z = Math.sin(balanceOscillation) * 0.9;
      }

      // 3. Hands rotation (Sweeping seconds, realistic minute, hour)
      if (secondsHandRef.current) {
        secondsHandRef.current.rotation.z = -elapsed * 0.6; // smooth sweep
      }
      if (minutesHandRef.current) {
        minutesHandRef.current.rotation.z = -elapsed * 0.05;
      }
      if (hoursHandRef.current) {
        hoursHandRef.current.rotation.z = -elapsed * 0.004;
      }

      // 4. Rotor swinging inertia
      if (rotorGroupRef.current) {
        rotorMomentum += (Math.sin(elapsed * 1.5) * 0.02 - rotorMomentum) * 0.1;
        rotorGroupRef.current.rotation.z += rotorMomentum;
      }

      // 5. Update Exploded View Layers displacement along Z
      const exp = exploded;
      if (crystalMeshRef.current) crystalMeshRef.current.position.z = 0.24 + exp * 2.8;
      if (bezelGroupRef.current) bezelGroupRef.current.position.z = 0 + exp * 1.9;
      if (handsGroupRef.current) handsGroupRef.current.position.z = 0.14 + exp * 1.1;
      if (dialGroupRef.current) dialGroupRef.current.position.z = 0.06 + exp * 0.5;
      if (tourbillonGroupRef.current) tourbillonGroupRef.current.position.z = 0.02 + exp * 0.15;
      if (caseGroupRef.current) caseGroupRef.current.position.z = 0 - exp * 0.6;
      if (rotorGroupRef.current) rotorGroupRef.current.position.z = -0.32 - exp * 1.4;
      if (casebackGroupRef.current) casebackGroupRef.current.position.z = -0.42 - exp * 2.2;

      // Project 3D Hotspots to screen space
      if (mountRef.current && masterWatch) {
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;

        setHotspots((prev) =>
          prev.map((hs) => {
            const worldPos = hs.position.clone();
            worldPos.applyMatrix4(masterWatch.matrixWorld);
            const screenPos = worldPos.project(camera);

            const isFront = screenPos.z < 1;
            const px = ((screenPos.x + 1) * w) / 2;
            const py = ((-screenPos.y + 1) * h) / 2;

            return {
              ...hs,
              screenPos: {
                x: px,
                y: py,
                visible: isFront && px >= 20 && px <= w - 20 && py >= 20 && py <= h - 20,
              },
            };
          })
        );
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Mouse Drag Rotation
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !watchGroupRef.current) return;
      const dx = e.clientX - prevMousePos.current.x;
      const dy = e.clientY - prevMousePos.current.y;

      watchGroupRef.current.rotation.y += dx * 0.007;
      watchGroupRef.current.rotation.x += dy * 0.007;

      rotationVelocity.current = { x: dy * 0.003, y: dx * 0.003 };
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    // Touch Support
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        prevMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || !watchGroupRef.current || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevMousePos.current.x;
      const dy = e.touches[0].clientY - prevMousePos.current.y;

      watchGroupRef.current.rotation.y += dx * 0.008;
      watchGroupRef.current.rotation.x += dy * 0.008;

      rotationVelocity.current = { x: dy * 0.003, y: dx * 0.003 };
      prevMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    // Zoom on Wheel
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      const zoomDelta = e.deltaY * 0.003;
      const newZ = Math.max(2.2, Math.min(8.0, cameraTargetPos.current.z + zoomDelta));
      cameraTargetPos.current.z = newZ;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    domElement.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      domElement.removeEventListener('wheel', handleWheel);

      renderer.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-[620px] md:h-[720px] bg-[#08090c] overflow-hidden select-none ${className}`}>
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* TOP LEFT: Minimalist Calibre Specification Badge */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0f1117]/80 border border-white/10 rounded-md backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
          <span className="font-serif text-xs tracking-wider text-[#d4af37] uppercase font-bold">
            Calibre 904-TR
          </span>
          <span className="text-white/40 text-xs">/</span>
          <span className="font-mono text-xs text-white/70">28,800 VPH</span>
        </div>
        <p className="mt-1.5 text-xs text-white/50 font-sans tracking-wide">
          Sürükleyerek 360° döndürün · Yakınlaştırmak için kaydırın
        </p>
      </div>

      {/* TOP RIGHT: Action Quick Controls */}
      <div className="absolute top-6 right-6 z-10 flex items-center gap-2">
        <button
          onClick={toggleSound}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
            soundEnabled
              ? 'bg-[#d4af37] text-black font-semibold'
              : 'bg-[#12141c]/90 text-white/80 hover:text-white border border-white/10'
          }`}
          title="Mekanik Saat Tik-Tak Sesi"
        >
          {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          <span className="hidden sm:inline">
            {soundEnabled ? 'Mekanizma: Aktif' : 'Mekanizma Sesi'}
          </span>
        </button>

        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-md transition-colors ${
            autoRotate
              ? 'bg-white/15 text-[#d4af37]'
              : 'bg-[#12141c]/90 text-white/60 hover:text-white border border-white/10'
          }`}
          title="Otomatik Döndürme"
        >
          <RotateCcw size={15} />
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-md bg-[#12141c]/90 text-white/60 hover:text-white border border-white/10 transition-colors"
          title="Tam Ekran"
        >
          {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>
      </div>

      {/* 3D INTERACTIVE HOTSPOT MARKERS */}
      {hotspots.map(
        (hs) =>
          hs.screenPos.visible && (
            <div
              key={hs.id}
              style={{
                left: `${hs.screenPos.x}px`,
                top: `${hs.screenPos.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-10 pointer-events-auto"
            >
              <button
                onClick={() => {
                  setActiveHotspot(activeHotspot?.id === hs.id ? null : hs);
                  horologySound.playMetallicClick();
                }}
                className={`group relative flex items-center justify-center w-6 h-6 rounded-full transition-transform hover:scale-125 ${
                  activeHotspot?.id === hs.id
                    ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/40 ring-4 ring-[#d4af37]/20'
                    : 'bg-black/80 border border-[#d4af37]/80 text-[#d4af37]'
                }`}
              >
                <span className="text-[10px] font-mono font-bold">+</span>
              </button>
            </div>
          )
      )}

      {/* HOTSPOT POPUP INFO CARD */}
      {activeHotspot && (
        <div
          style={{
            left: `${Math.min(Math.max(activeHotspot.screenPos.x, 160), window.innerWidth - 180)}px`,
            top: `${Math.max(activeHotspot.screenPos.y - 80, 80)}px`,
            transform: 'translate(-50%, -100%)',
          }}
          className="absolute z-20 w-72 p-4 bg-[#10121a]/95 border border-[#d4af37]/40 rounded-xl shadow-2xl backdrop-blur-md pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#d4af37]">
                Haute Horlogerie Detay
              </span>
              <h4 className="font-serif text-sm font-bold text-white mt-0.5">
                {activeHotspot.name}
              </h4>
            </div>
            <button
              onClick={() => setActiveHotspot(null)}
              className="text-white/40 hover:text-white text-sm"
            >
              ✕
            </button>
          </div>
          <p className="mt-2 text-xs text-white/70 leading-relaxed font-sans">
            {activeHotspot.desc}
          </p>
        </div>
      )}

      {/* ERGONOMIC COLLAPSIBLE BOTTOM CONTROL DOCK (Zero Viewport Occlusion) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[860px]">
        {/* Collapse / Expand Tab Toggle */}
        <div className="flex justify-center -mb-px">
          <button
            onClick={() => setHudCollapsed(!hudCollapsed)}
            className="flex items-center gap-1.5 px-4 py-1 bg-[#10121a]/95 border-t border-x border-white/15 rounded-t-lg text-[11px] font-mono text-white/70 hover:text-[#d4af37] transition-colors shadow-lg"
          >
            {hudCollapsed ? (
              <>
                <ChevronUp size={13} />
                <span>Kontrol Panelini Aç</span>
              </>
            ) : (
              <>
                <ChevronDown size={13} />
                <span>Sinema Modu (Gizle)</span>
              </>
            )}
          </button>
        </div>

        {/* Main Dock Container */}
        <div
          className={`transition-all duration-300 ease-out origin-bottom ${
            hudCollapsed ? 'opacity-0 translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'
          }`}
        >
          <div className="p-3.5 bg-[#10121a]/95 border border-white/15 rounded-xl shadow-2xl backdrop-blur-md space-y-3">
            {/* Row 1: Exploded View Slider & Camera Presets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
              {/* Exploded View Slider */}
              <div className="flex items-center gap-3 bg-black/40 px-3 py-2 rounded-lg border border-white/5">
                <Layers size={15} className="text-[#d4af37] shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-sans font-medium text-white/80">
                      Patlatılmış Mekanizma Görünümü
                    </span>
                    <span className="font-mono text-[10px] text-[#d4af37]">
                      {Math.round(exploded * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={exploded}
                    onChange={(e) => handleExplodedSlider(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
                  />
                </div>
              </div>

              {/* Camera Presets Tabs */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5 overflow-x-auto">
                <span className="text-[10px] font-mono uppercase text-white/40 px-2 shrink-0">
                  Açı:
                </span>
                {(
                  [
                    { id: 'angle', label: 'Stüdyo 45°' },
                    { id: 'front', label: 'Kadran' },
                    { id: 'tourbillon', label: 'Tourbillon' },
                    { id: 'side', label: 'Kasa & Tepe' },
                    { id: 'caseback', label: 'Arka Kapak' },
                  ] as const
                ).map((cam) => (
                  <button
                    key={cam.id}
                    onClick={() => setCameraPreset(cam.id)}
                    className={`px-2.5 py-1 text-xs rounded font-sans transition-colors whitespace-nowrap shrink-0 ${
                      activePreset === cam.id
                        ? 'bg-[#d4af37] text-black font-semibold shadow-sm'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {cam.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Material Finish Swatches */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[#d4af37] shrink-0" />
                <span className="text-xs text-white/70 font-sans hidden sm:inline">
                  Gövde & Kadran Materyali:
                </span>
              </div>

              <div className="flex items-center gap-2">
                {(
                  [
                    {
                      id: 'rose-gold',
                      label: '18K Pembe Altın',
                      color: 'bg-[#d4a373]',
                    },
                    {
                      id: 'titanium',
                      label: 'Titanyum Grade 5',
                      color: 'bg-[#717782]',
                    },
                    {
                      id: 'platinum',
                      label: 'Platin & Gece Mavisi',
                      color: 'bg-[#0a1931] border border-white/40',
                    },
                    {
                      id: 'forged-carbon',
                      label: 'Dövme Karbon & Zümrüt',
                      color: 'bg-[#222428] border border-[#2ec4b6]',
                    },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleFinishSelect(item.id)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs transition-all ${
                      finish === item.id
                        ? 'bg-white/15 border border-[#d4af37] text-[#d4af37] font-medium'
                        : 'text-white/60 hover:text-white border border-transparent'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="hidden md:inline">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
