import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ArrowRight, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import {
  ARCHITECTURAL_ZONES,
  ArchitecturalZone,
  dampScalar,
  findZoneById,
  OVERVIEW_CAMERA_POSE,
} from '../utils/buildingModelData';
import { ProjectItem, SELECTED_PROJECTS } from '../data/studioData';
import { createProceduralBuildingTextures } from '../utils/proceduralTextures';

interface InteractiveBuilding3DProps {
  onSelectProject: (project: ProjectItem) => void;
}

// Pre-allocated scratch vectors for zero-GC render ticks
const _pointer = new THREE.Vector2();

function detectSoftwareWebGL(): boolean {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function InteractiveBuilding3D({ onSelectProject }: InteractiveBuilding3DProps) {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
  const [dockExpanded, setDockExpanded] = useState<boolean>(true);
  const [webglUnavailable, setWebglUnavailable] = useState<boolean>(false);

  const selectedZoneRef = useRef<string | null>(null);
  const hoveredZoneRef = useRef<string | null>(null);
  const triggerZoneFocusRef = useRef<((zoneId: string | null) => void) | null>(null);
  const requestRenderRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    selectedZoneRef.current = selectedZoneId;
  }, [selectedZoneId]);

  useEffect(() => {
    hoveredZoneRef.current = hoveredZoneId;
  }, [hoveredZoneId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) {
        return;
      }
      if (event.key === 'h' || event.key === 'H') {
        setDockExpanded((prev) => !prev);
      } else if (event.key === 'Escape' && selectedZoneRef.current) {
        triggerZoneFocusRef.current?.(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 320);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.94;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x231f1b);
    scene.fog = new THREE.FogExp2(0x231f1b, 0.015);

    // Procedural Studio Environment for crisp glass & bronze reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 150);
    camera.position.set(...OVERVIEW_CAMERA_POSE.position);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...OVERVIEW_CAMERA_POSE.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI / 2 - 0.06;
    controls.minDistance = 6.5;
    controls.maxDistance = 30;
    controls.enablePan = false;
    controls.update();

    // Lighting Rig: Warm Golden Sun + Cool Architectural Hemisphere Fill
    const hemiLight = new THREE.HemisphereLight(0xd4dee8, 0x54473a, 0.54);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffe1bd, 1.48);
    keyLight.position.set(14, 20, 12);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 2;
    keyLight.shadow.camera.far = 55;
    const d = 14;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xaec4db, 0.75);
    rimLight.position.set(-14, 10, -12);
    scene.add(rimLight);

    // Textures & Shared Materials
    const textures = createProceduralBuildingTextures(
      renderer.capabilities.getMaxAnisotropy(),
    );

    const travertineMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: textures.travertineColor,
      bumpMap: textures.travertineBump,
      bumpScale: 0.025,
      roughness: 0.78,
      metalness: 0.04,
    });
    const darkStoneMat = new THREE.MeshStandardMaterial({
      color: 0x3b352f,
      bumpMap: textures.travertineBump,
      bumpScale: 0.035,
      roughness: 0.85,
      metalness: 0.06,
    });
    const warmPlasterMat = new THREE.MeshStandardMaterial({
      color: 0xc4b7a4,
      roughness: 0.84,
      metalness: 0.02,
    });
    const walnutMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: textures.timberColor,
      roughness: 0.56,
      metalness: 0.05,
    });
    const bronzeMetalMat = new THREE.MeshStandardMaterial({
      color: 0x8f7458,
      roughness: 0.28,
      metalness: 0.88,
    });
    const darkSteelMat = new THREE.MeshStandardMaterial({
      color: 0x201d1a,
      roughness: 0.35,
      metalness: 0.78,
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xcfe0e8,
      roughness: 0.08,
      metalness: 0.08,
      transmission: isSoftwareGl ? 0 : 0.68,
      transparent: true,
      opacity: isSoftwareGl ? 0.38 : 0.88,
      ior: 1.5,
      reflectivity: 0.85,
    });
    const foliageMat = new THREE.MeshStandardMaterial({
      color: 0x4c6244,
      roughness: 0.86,
      metalness: 0.02,
    });
    const courtyardMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: textures.courtyardColor,
      roughness: 0.88,
      metalness: 0.04,
    });
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x3d5c66,
      roughness: 0.12,
      metalness: 0.25,
    });

    const geometriesToDispose: THREE.BufferGeometry[] = [];
    const materialsToDispose: THREE.Material[] = [
      travertineMat,
      darkStoneMat,
      warmPlasterMat,
      walnutMat,
      bronzeMetalMat,
      darkSteelMat,
      glassMat,
      foliageMat,
      courtyardMat,
      waterMat,
    ];

    const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      geometriesToDispose.push(g);
      return g;
    };

    // 1. Ground Horizon Plane & Courtyard Plinth (offset >= 0.02 to prevent Z-fighting)
    const horizonPlane = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(140, 140)),
      new THREE.MeshStandardMaterial({ color: 0x1e1a16, roughness: 0.96, metalness: 0 }),
    );
    materialsToDispose.push(horizonPlane.material);
    horizonPlane.rotation.x = -Math.PI / 2;
    horizonPlane.position.y = -0.04;
    horizonPlane.receiveShadow = true;
    scene.add(horizonPlane);

    const plinth = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(15.5, 0.36, 15.5)),
      courtyardMat,
    );
    plinth.position.set(0, 0.16, 1.2);
    plinth.receiveShadow = true;
    scene.add(plinth);

    // Soft radial contact shadow under main building footprint
    const contactShadowPlane = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(16, 14)),
      new THREE.MeshBasicMaterial({
        map: textures.contactShadow,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      }),
    );
    materialsToDispose.push(contactShadowPlane.material);
    contactShadowPlane.rotation.x = -Math.PI / 2;
    contactShadowPlane.position.set(0, 0.355, -0.2);
    scene.add(contactShadowPlane);

    // 2. Main Villa Group
    const villaGroup = new THREE.Group();
    scene.add(villaGroup);

    // Ground Floor Slab + Recessed Gallery Wing (Left / Atrium)
    const groundSlab = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(10.8, 0.28, 7.6)),
      travertineMat,
    );
    groundSlab.position.set(0, 0.48, -0.4);
    groundSlab.castShadow = true;
    groundSlab.receiveShadow = true;
    villaGroup.add(groundSlab);

    // Level 01 Structural Core & Back Wall
    const level1BackWall = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(10.6, 3.1, 0.4)),
      warmPlasterMat,
    );
    level1BackWall.position.set(0, 2.15, -3.9);
    level1BackWall.castShadow = true;
    level1BackWall.receiveShadow = true;
    villaGroup.add(level1BackWall);

    const level1MidDivider = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.35, 3.1, 6.8)),
      travertineMat,
    );
    level1MidDivider.position.set(0.4, 2.15, -0.4);
    level1MidDivider.castShadow = true;
    villaGroup.add(level1MidDivider);

    // Level 01 Left: Arched Gallery & Lounge Glass Facade + Brick Feature Wall
    const brickGalleryMat = new THREE.MeshStandardMaterial({
      color: 0x8f4c36,
      bumpMap: textures.travertineBump,
      bumpScale: 0.04,
      roughness: 0.86,
      metalness: 0.03,
    });
    materialsToDispose.push(brickGalleryMat);

    const galleryInnerBack = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(4.8, 2.75, 0.35)),
      brickGalleryMat,
    );
    galleryInnerBack.position.set(-2.4, 2.05, -2.5);
    villaGroup.add(galleryInnerBack);

    const galleryGlass = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(5.1, 2.8, 0.1)),
      glassMat,
    );
    galleryGlass.position.set(-2.3, 2.05, 2.8);
    villaGroup.add(galleryGlass);

    // Steel mullions on Gallery Facade
    for (let i = 0; i < 5; i++) {
      const mullion = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.08, 2.95, 0.16)),
        darkSteelMat,
      );
      mullion.position.set(-4.75 + i * 1.22, 2.08, 2.82);
      mullion.castShadow = true;
      villaGroup.add(mullion);
    }

    // Level 01 Right: Stone Portico & Arrival Porch (twin columns + timber door)
    const porticoStonePierL = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.55, 3.15, 0.55)),
      darkStoneMat,
    );
    porticoStonePierL.position.set(1.1, 2.15, 2.85);
    porticoStonePierL.castShadow = true;
    villaGroup.add(porticoStonePierL);

    const porticoStonePierR = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.55, 3.15, 0.55)),
      darkStoneMat,
    );
    porticoStonePierR.position.set(4.8, 2.15, 2.85);
    porticoStonePierR.castShadow = true;
    villaGroup.add(porticoStonePierR);

    const timberEntryDoor = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(1.8, 2.65, 0.14)),
      walnutMat,
    );
    timberEntryDoor.position.set(2.95, 1.95, 1.45);
    timberEntryDoor.castShadow = true;
    villaGroup.add(timberEntryDoor);

    const porticoSteps = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(4.2, 0.22, 1.2)),
      travertineMat,
    );
    porticoSteps.position.set(2.95, 0.42, 3.45);
    porticoSteps.receiveShadow = true;
    villaGroup.add(porticoSteps);

    // Level 02 Floor Slab (with warm timber soffit trim underneath)
    const level2Slab = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(11.4, 0.34, 8.2)),
      travertineMat,
    );
    level2Slab.position.set(0, 3.72, -0.2);
    level2Slab.castShadow = true;
    level2Slab.receiveShadow = true;
    villaGroup.add(level2Slab);

    const timberSoffit = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(11.1, 0.08, 7.9)),
      walnutMat,
    );
    timberSoffit.position.set(0, 3.53, -0.2);
    villaGroup.add(timberSoffit);

    // Level 02 Right: Master Bedroom Suite Volume + Open Corner Glazing & Detailed Interior
    const suiteBackWall = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(5.4, 2.9, 0.35)),
      warmPlasterMat,
    );
    suiteBackWall.position.set(2.5, 5.25, -3.7);
    suiteBackWall.castShadow = true;
    villaGroup.add(suiteBackWall);

    // Timber plank flooring inside the Master Suite
    const suiteWoodFloor = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(5.1, 0.05, 5.8)),
      walnutMat,
    );
    suiteWoodFloor.position.set(2.6, 3.91, -0.6);
    villaGroup.add(suiteWoodFloor);

    // Recessed corner structural column (leaves East & Front open to glazing)
    const suiteCornerColumn = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.32, 2.9, 0.32)),
      darkSteelMat,
    );
    suiteCornerColumn.position.set(5.1, 5.25, 2.3);
    suiteCornerColumn.castShadow = true;
    villaGroup.add(suiteCornerColumn);

    const suiteRearSideWall = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.32, 2.9, 2.6)),
      travertineMat,
    );
    suiteRearSideWall.position.set(5.1, 5.25, -2.5);
    suiteRearSideWall.castShadow = true;
    villaGroup.add(suiteRearSideWall);

    // Bedroom Interior: Walnut panelling + Stone feature + Upholstered Bed + Side Tables & Warm Lamps
    const headboardPanel = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(3.4, 2.35, 0.16)),
      walnutMat,
    );
    headboardPanel.position.set(2.6, 5.1, -3.45);
    villaGroup.add(headboardPanel);

    const stoneCenterInlay = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(1.4, 2.25, 0.2)),
      travertineMat,
    );
    stoneCenterInlay.position.set(2.6, 5.1, -3.4);
    villaGroup.add(stoneCenterInlay);

    const suiteRug = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(2.9, 0.03, 2.8)),
      warmPlasterMat,
    );
    suiteRug.position.set(2.6, 3.95, -1.65);
    villaGroup.add(suiteRug);

    const bedBase = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(1.85, 0.44, 2.2)),
      new THREE.MeshStandardMaterial({ color: 0xe6dfd4, roughness: 0.9, metalness: 0 }),
    );
    materialsToDispose.push(bedBase.material);
    bedBase.position.set(2.6, 4.18, -2.1);
    villaGroup.add(bedBase);

    const accentThrow = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(1.88, 0.1, 0.75)),
      darkStoneMat,
    );
    accentThrow.position.set(2.6, 4.42, -1.4);
    villaGroup.add(accentThrow);

    // Warm emissive bedside lamp shades & ceiling cove glow
    const warmLampMat = new THREE.MeshStandardMaterial({
      color: 0xffe4b8,
      emissive: 0xffb866,
      emissiveIntensity: 1.4,
      roughness: 0.4,
    });
    materialsToDispose.push(warmLampMat);

    [-1.25, 1.25].forEach((dx) => {
      const table = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.5, 0.45, 0.45)),
        walnutMat,
      );
      table.position.set(2.6 + dx, 4.16, -3.0);
      villaGroup.add(table);

      const lampShade = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.14, 0.17, 0.24, 14)),
        warmLampMat,
      );
      lampShade.position.set(2.6 + dx, 4.62, -3.0);
      villaGroup.add(lampShade);
    });

    const ceilingCove = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(3.8, 0.06, 0.18)),
      warmLampMat,
    );
    ceilingCove.position.set(2.6, 6.55, -2.8);
    villaGroup.add(ceilingCove);

    const bedroomFrontGlass = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(4.7, 2.7, 0.08)),
      glassMat,
    );
    bedroomFrontGlass.position.set(2.65, 5.22, 2.3);
    villaGroup.add(bedroomFrontGlass);

    const bedroomEastGlass = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.08, 2.7, 3.4)),
      glassMat,
    );
    bedroomEastGlass.position.set(5.1, 5.22, 0.55);
    villaGroup.add(bedroomEastGlass);

    // Level 02 Left: Sculpted Curved Concrete Balcony Frame + Vertical Timber Louvers
    const curveShape = new THREE.Shape();
    curveShape.moveTo(-5.3, 0);
    curveShape.lineTo(0.2, 0);
    curveShape.lineTo(0.2, 2.85);
    curveShape.lineTo(-5.3, 2.85);
    curveShape.closePath();

    const holePath = new THREE.Path();
    holePath.moveTo(-4.4, 0.38);
    holePath.lineTo(-0.35, 0.38);
    holePath.quadraticCurveTo(-0.05, 1.45, -0.35, 2.48);
    holePath.lineTo(-4.4, 2.48);
    holePath.quadraticCurveTo(-4.9, 1.45, -4.4, 0.38);
    curveShape.holes.push(holePath);

    const balconyExtrude = new THREE.ExtrudeGeometry(curveShape, {
      depth: 1.5,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.05,
      bevelSegments: 2,
      curveSegments: 18,
    });
    geometriesToDispose.push(balconyExtrude);

    const curvedBalconyMesh = new THREE.Mesh(balconyExtrude, travertineMat);
    curvedBalconyMesh.position.set(0, 3.85, 1.75);
    curvedBalconyMesh.castShadow = true;
    curvedBalconyMesh.receiveShadow = true;
    villaGroup.add(curvedBalconyMesh);

    const balconyGlassRail = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(4.4, 0.85, 0.08)),
      glassMat,
    );
    balconyGlassRail.position.set(-2.35, 4.35, 3.1);
    villaGroup.add(balconyGlassRail);

    // Vertical Walnut Louver Screen (11 crisp fins on front-left facade)
    for (let i = 0; i < 11; i++) {
      const fin = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.09, 6.2, 0.28)),
        walnutMat,
      );
      fin.position.set(-5.35, 3.55, -2.5 + i * 0.45);
      fin.castShadow = true;
      villaGroup.add(fin);
    }

    // Roof Cantilevered Pergola & Parapet
    const roofSlab = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(11.8, 0.32, 8.6)),
      travertineMat,
    );
    roofSlab.position.set(0, 6.82, -0.3);
    roofSlab.castShadow = true;
    villaGroup.add(roofSlab);

    const roofSoffit = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(11.4, 0.08, 8.2)),
      walnutMat,
    );
    roofSoffit.position.set(0, 6.64, -0.3);
    villaGroup.add(roofSoffit);

    // 3. Courtyard Water Feature & Boundary Gate
    const fountainBasin = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(1.7, 1.85, 0.45, 28)),
      travertineMat,
    );
    fountainBasin.position.set(-1.4, 0.52, 5.5);
    fountainBasin.castShadow = true;
    fountainBasin.receiveShadow = true;
    scene.add(fountainBasin);

    const fountainWater = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(1.48, 1.48, 0.08, 24)),
      waterMat,
    );
    fountainWater.position.set(-1.4, 0.72, 5.5);
    scene.add(fountainWater);

    const fountainSpire = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.22, 0.42, 0.95, 16)),
      travertineMat,
    );
    fountainSpire.position.set(-1.4, 1.0, 5.5);
    fountainSpire.castShadow = true;
    scene.add(fountainSpire);

    // Perimeter Boundary Timber Gate & Stone Piers
    const frontWallLeft = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(4.6, 1.35, 0.32)),
      darkStoneMat,
    );
    frontWallLeft.position.set(-4.8, 0.98, 8.4);
    frontWallLeft.castShadow = true;
    scene.add(frontWallLeft);

    const timberGate = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(4.2, 1.4, 0.14)),
      walnutMat,
    );
    timberGate.position.set(2.9, 1.0, 8.4);
    timberGate.castShadow = true;
    scene.add(timberGate);

    // Architectural Trees (3-part composite grounded at plinth y = 0.34)
    const addTree = (x: number, z: number, scale: number) => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.12 * scale, 0.18 * scale, 1.8 * scale, 10)),
        walnutMat,
      );
      trunk.position.y = 0.9 * scale;
      trunk.castShadow = true;
      tree.add(trunk);

      const canopy1 = new THREE.Mesh(
        trackGeo(new THREE.DodecahedronGeometry(0.95 * scale, 1)),
        foliageMat,
      );
      canopy1.position.set(0, 2.1 * scale, 0);
      canopy1.castShadow = true;
      tree.add(canopy1);

      const canopy2 = new THREE.Mesh(
        trackGeo(new THREE.DodecahedronGeometry(0.7 * scale, 1)),
        foliageMat,
      );
      canopy2.position.set(0.45 * scale, 1.75 * scale, 0.25 * scale);
      canopy2.castShadow = true;
      tree.add(canopy2);

      tree.position.set(x, 0.34, z);
      scene.add(tree);
    };

    addTree(-6.2, 5.2, 1.05);
    addTree(6.4, 4.6, 0.92);
    addTree(-6.4, -3.2, 1.15);

    // 4. Interactive Architectural Zone Volumes + Warm Interior Lights
    const zoneLights = new Map<string, THREE.PointLight>();
    const zoneHighlightWireframes = new Map<string, THREE.LineSegments>();
    const zoneHighlightFills = new Map<string, THREE.Mesh>();
    const proxyHitboxes: THREE.Mesh[] = [];

    ARCHITECTURAL_ZONES.forEach((zone) => {
      // Warm architectural glow inside the corresponding room
      const roomLight = new THREE.PointLight(0xffcf94, 1.1, 8, 2);
      roomLight.position.set(...zone.highlightCenter);
      scene.add(roomLight);
      zoneLights.set(zone.id, roomLight);

      // Subtle wireframe architectural highlight box
      const boxGeo = trackGeo(
        new THREE.BoxGeometry(
          zone.highlightSize[0],
          zone.highlightSize[1],
          zone.highlightSize[2],
        ),
      );
      const edgesGeo = trackGeo(new THREE.EdgesGeometry(boxGeo));
      const wireMat = new THREE.LineBasicMaterial({
        color: 0xd9c2a3,
        transparent: true,
        opacity: 0.0,
      });
      materialsToDispose.push(wireMat);

      const wire = new THREE.LineSegments(edgesGeo, wireMat);
      wire.position.set(...zone.highlightCenter);
      scene.add(wire);
      zoneHighlightWireframes.set(zone.id, wire);

      const fillMat = new THREE.MeshBasicMaterial({
        color: 0x92795f,
        transparent: true,
        opacity: 0.0,
        depthWrite: false,
      });
      materialsToDispose.push(fillMat);

      const fillMesh = new THREE.Mesh(boxGeo, fillMat);
      fillMesh.position.set(...zone.highlightCenter);
      scene.add(fillMesh);
      zoneHighlightFills.set(zone.id, fillMesh);

      // Dedicated invisible proxy hitbox on raycaster layer 1
      const hitbox = new THREE.Mesh(
        boxGeo,
        new THREE.MeshBasicMaterial({ visible: false }),
      );
      materialsToDispose.push(hitbox.material);
      hitbox.position.set(...zone.highlightCenter);
      hitbox.layers.set(1);
      hitbox.userData.zoneId = zone.id;
      scene.add(hitbox);
      proxyHitboxes.push(hitbox);
    });

    // Raycaster restricted exclusively to Layer 1 proxy hitboxes
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);

    // Camera Transition State
    const targetCamPos = new THREE.Vector3(...OVERVIEW_CAMERA_POSE.position);
    const targetLookAt = new THREE.Vector3(...OVERVIEW_CAMERA_POSE.target);
    let isGliding = false;
    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let lastTickTime = performance.now();

    const applyVisualHighlightStates = () => {
      const activeId = selectedZoneRef.current;
      const hoverId = hoveredZoneRef.current;
      ARCHITECTURAL_ZONES.forEach((z) => {
        const isSelected = z.id === activeId;
        const isHovered = z.id === hoverId;

        const wire = zoneHighlightWireframes.get(z.id);
        const fill = zoneHighlightFills.get(z.id);
        const light = zoneLights.get(z.id);

        if (wire) {
          const mat = wire.material as THREE.LineBasicMaterial;
          mat.opacity = isSelected ? 0.85 : isHovered ? 0.55 : 0.0;
        }
        if (fill) {
          const mat = fill.material as THREE.MeshBasicMaterial;
          mat.opacity = isSelected ? 0.14 : isHovered ? 0.08 : 0.0;
        }
        if (light) {
          light.intensity = isSelected ? 3.2 : isHovered ? 2.1 : 1.0;
        }
      });
    };

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync?.(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const requestRender = () => {
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = window.requestAnimationFrame(() => {
        renderDirty = false;
        const now = performance.now();
        const dt = Math.min((now - lastTickTime) / 1000, 0.1);
        lastTickTime = now;

        if (isGliding) {
          camera.position.x = dampScalar(camera.position.x, targetCamPos.x, 5.5, dt);
          camera.position.y = dampScalar(camera.position.y, targetCamPos.y, 5.5, dt);
          camera.position.z = dampScalar(camera.position.z, targetCamPos.z, 5.5, dt);

          controls.target.x = dampScalar(controls.target.x, targetLookAt.x, 5.5, dt);
          controls.target.y = dampScalar(controls.target.y, targetLookAt.y, 5.5, dt);
          controls.target.z = dampScalar(controls.target.z, targetLookAt.z, 5.5, dt);

          const posDist = camera.position.distanceTo(targetCamPos);
          const tgtDist = controls.target.distanceTo(targetLookAt);
          if (posDist < 0.03 && tgtDist < 0.03) {
            camera.position.copy(targetCamPos);
            controls.target.copy(targetLookAt);
            isGliding = false;
          } else {
            renderDirty = true;
          }
        }

        applyVisualHighlightStates();
        controls.update();
        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (renderDirty) requestRender();
        };

        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    };

    triggerZoneFocusRef.current = (zoneId: string | null) => {
      selectedZoneRef.current = zoneId;
      setSelectedZoneId(zoneId);
      const zone = findZoneById(zoneId);
      if (zone) {
        targetCamPos.set(...zone.cameraPosition);
        targetLookAt.set(...zone.cameraTarget);
      } else {
        targetCamPos.set(...OVERVIEW_CAMERA_POSE.position);
        targetLookAt.set(...OVERVIEW_CAMERA_POSE.target);
      }
      isGliding = true;
      lastTickTime = performance.now();
      requestRender();
    };
    requestRenderRef.current = requestRender;

    // Cancel camera glide if user grabs OrbitControls manually
    const onControlStart = () => {
      isGliding = false;
    };
    const onControlChange = () => {
      requestRender();
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('change', onControlChange);

    // Throttled Pointer Hover + Click Raycasting
    let lastHoverCheck = 0;
    let pointerDownPos = { x: 0, y: 0 };

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      _pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      _pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverCheck < 45) return;
      lastHoverCheck = now;

      updatePointer(e.clientX, e.clientY);
      raycaster.setFromCamera(_pointer, camera);
      const hits = raycaster.intersectObjects(proxyHitboxes, false);
      const nextHover = hits.length > 0 ? (hits[0].object.userData.zoneId as string) : null;

      if (nextHover !== hoveredZoneRef.current) {
        hoveredZoneRef.current = nextHover;
        setHoveredZoneId(nextHover);
        renderer.domElement.style.cursor = nextHover ? 'pointer' : 'grab';
        requestRender();
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      const moved = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (moved > 6) return; // Dragging orbit, not a click

      updatePointer(e.clientX, e.clientY);
      raycaster.setFromCamera(_pointer, camera);
      const hits = raycaster.intersectObjects(proxyHitboxes, false);
      if (hits.length > 0) {
        const hitZoneId = hits[0].object.userData.zoneId as string;
        triggerZoneFocusRef.current?.(hitZoneId);
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    const onResize = () => {
      if (!container) return;
      const w = Math.max(container.clientWidth, 320);
      const h = Math.max(container.clientHeight, 320);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    window.addEventListener('resize', onResize);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglUnavailable(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }
    requestRender();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
      window.removeEventListener('resize', onResize);
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('change', onControlChange);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      controls.dispose();
      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
      textures.dispose();
      envTarget.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const activeZone: ArchitecturalZone | undefined = findZoneById(selectedZoneId);
  const hoveredZone: ArchitecturalZone | undefined = findZoneById(hoveredZoneId);
  const activeProject = activeZone
    ? SELECTED_PROJECTS.find((p) => p.id === activeZone.projectId)
    : undefined;

  return (
    <section
      id="architecture-3d"
      aria-label="Interactive Architectural Residence Explorer"
      className="relative scroll-mt-20 bg-[#231F1B] text-[#F2EFE9]"
    >
      {/* Editorial Section Header Above Viewport */}
      <div className="mx-auto max-w-[1440px] border-b border-[#34302B] px-6 pb-10 pt-14 md:px-12 md:pb-12 md:pt-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#A99F91]">
              Interactive Spatial Study · 01 — 05
            </p>
            <h2 className="mt-3 font-serif text-3xl font-medium leading-[1.1] text-[#F2EFE9] sm:text-4xl lg:text-5xl">
              Explore the Architectural Model
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#D9D1C5]">
            Orbit the residence or select a structural volume below to inspect Shakyawar Design Studio&apos;s interior, facade, and courtyard commissions.
          </p>
        </div>
      </div>

      {/* Unobstructed Interactive 3D Viewport */}
      <div className="relative h-[78vh] min-h-[540px] max-h-[840px] w-full overflow-hidden">
        {webglUnavailable ? (
          <div className="flex h-full w-full flex-col items-center justify-center bg-[#231F1B] px-6 text-center">
            <p className="font-serif text-2xl text-[#F2EFE9]">
              3D Spatial Model Preview
            </p>
            <p className="mt-2 max-w-md text-sm text-[#A99F91]">
              Interactive WebGL is unavailable in this browser context. Select any architectural discipline below to browse completed work.
            </p>
          </div>
        ) : (
          <div
            ref={canvasMountRef}
            data-testid="building-3d-canvas-container"
            data-active-zone={selectedZoneId ?? 'overview'}
            className="h-full w-full"
          />
        )}

        {/* Hover Label (top-left quiet architectural tag, no backdrop-blur over WebGL) */}
        {hoveredZone && !activeZone && (
          <div className="pointer-events-none absolute left-6 top-6 z-20 border border-[#92795F]/50 bg-[#231F1B]/95 px-4 py-2.5 md:left-12">
            <p className="text-[11px] font-medium tracking-[0.16em] uppercase text-[#A99F91] tabular-nums">
              {hoveredZone.code} · {hoveredZone.floorLevel}
            </p>
            <p className="mt-0.5 font-serif text-lg text-[#F2EFE9]">
              {hoveredZone.label}
            </p>
          </div>
        )}

        {/* Selected Room Project Inspector Panel (positioned cleanly clear of fixed navbar & bottom dock) */}
        {activeZone && activeProject && (
          <aside
            aria-label={`Project spotlight: ${activeProject.title}`}
            className="absolute bottom-24 right-4 z-30 w-[min(360px,calc(100vw-2rem))] border border-[#3E3832] bg-[#231F1B]/96 p-5 shadow-2xl md:right-10"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-medium tracking-[0.16em] uppercase text-[#A99F91] tabular-nums">
                  {activeZone.code} · {activeZone.floorLevel}
                </p>
                <h3 className="mt-1 font-serif text-2xl font-medium text-[#F2EFE9]">
                  {activeZone.label}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => triggerZoneFocusRef.current?.(null)}
                aria-label="Return to full building view"
                className="inline-flex items-center gap-1.5 border border-[#4A433B] px-2.5 py-1.5 text-[11px] font-medium tracking-[0.12em] uppercase text-[#D9D1C5] transition-colors hover:border-[#92795F] hover:text-[#F2EFE9]"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                Reset
              </button>
            </div>

            <div className="mt-4 aspect-[16/10] w-full overflow-hidden bg-[#1A1612]">
              <img
                src={activeProject.image}
                alt={activeProject.imageAlt}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-4">
              <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#92795F]">
                {activeProject.category} · {activeProject.location}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-[#D9D1C5]">
                {activeZone.description}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#34302B] pt-4">
              <button
                type="button"
                onClick={() => onSelectProject(activeProject)}
                className="inline-flex items-center gap-2 bg-[#F2EFE9] px-4 py-2 text-xs font-semibold tracking-[0.12em] uppercase text-[#29241F] transition-colors hover:bg-[#D9D1C5]"
              >
                Inspect Project
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => triggerZoneFocusRef.current?.(null)}
                className="text-xs font-medium tracking-[0.12em] uppercase text-[#A99F91] underline underline-offset-4 hover:text-[#F2EFE9]"
              >
                Full Building
              </button>
            </div>
          </aside>
        )}

        {/* Unified Collapsible Bottom Control Dock (Zero Viewport Occlusion) */}
        <div className="pointer-events-none absolute bottom-5 left-1/2 z-30 flex w-[min(1180px,95vw)] -translate-x-1/2 flex-col items-center">
          <button
            type="button"
            onClick={() => setDockExpanded((prev) => !prev)}
            aria-expanded={dockExpanded}
            className="pointer-events-auto mb-2 inline-flex items-center gap-2 border border-[#3E3832] bg-[#231F1B]/95 px-4 py-1.5 text-[11px] font-medium tracking-[0.16em] uppercase text-[#D9D1C5] transition-colors hover:border-[#92795F] hover:text-[#F2EFE9]"
          >
            {dockExpanded ? (
              <>
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                Hide Controls
              </>
            ) : (
              <>
                <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                Explore Spaces
              </>
            )}
          </button>

          {dockExpanded && (
            <div className="pointer-events-auto flex w-full items-center justify-between gap-2 overflow-x-auto border border-[#3E3832] bg-[#231F1B]/95 p-1.5 shadow-xl">
              <div className="flex items-center gap-1 flex-nowrap">
                <button
                  type="button"
                  onClick={() => triggerZoneFocusRef.current?.(null)}
                  className={`px-3 py-2 text-[11px] font-medium tracking-[0.1em] uppercase whitespace-nowrap shrink-0 transition-colors ${
                    selectedZoneId === null
                      ? 'bg-[#F2EFE9] text-[#29241F]'
                      : 'text-[#D9D1C5] hover:bg-[#34302B] hover:text-[#F2EFE9]'
                  }`}
                >
                  Full Exterior
                </button>
                {ARCHITECTURAL_ZONES.map((zone) => {
                  const isActive = selectedZoneId === zone.id;
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => triggerZoneFocusRef.current?.(zone.id)}
                      onMouseEnter={() => {
                        hoveredZoneRef.current = zone.id;
                        setHoveredZoneId(zone.id);
                        requestRenderRef.current?.();
                      }}
                      onMouseLeave={() => {
                        hoveredZoneRef.current = null;
                        setHoveredZoneId(null);
                        requestRenderRef.current?.();
                      }}
                      className={`px-3 py-2 text-xs font-medium tracking-[0.04em] whitespace-nowrap shrink-0 transition-colors ${
                        isActive
                          ? 'bg-[#92795F] text-[#F2EFE9]'
                          : 'text-[#D9D1C5] hover:bg-[#34302B] hover:text-[#F2EFE9]'
                      }`}
                    >
                      <span className="mr-1.5 text-[10px] opacity-75 tabular-nums">
                        {zone.code}
                      </span>
                      {zone.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
