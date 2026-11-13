import * as THREE from 'three';

export interface ProceduralTextureSet {
  travertineColor: THREE.CanvasTexture;
  travertineBump: THREE.CanvasTexture;
  timberColor: THREE.CanvasTexture;
  courtyardColor: THREE.CanvasTexture;
  contactShadow: THREE.CanvasTexture;
  dispose: () => void;
}

export function createProceduralBuildingTextures(maxAnisotropy: number): ProceduralTextureSet {
  const anisotropy = Math.max(1, Math.min(8, maxAnisotropy));

  // 1. Warm Travertine Limestone (Color + Bump)
  const stoneCanvas = document.createElement('canvas');
  stoneCanvas.width = 512;
  stoneCanvas.height = 512;
  const sCtx = stoneCanvas.getContext('2d')!;
  sCtx.fillStyle = '#CEC2AF';
  sCtx.fillRect(0, 0, 512, 512);

  for (let y = 0; y < 512; y += 2) {
    const vein = Math.sin(y * 0.045) * 7 + Math.cos(y * 0.13) * 5;
    const tone = Math.round(202 + vein);
    sCtx.fillStyle = `rgb(${tone}, ${tone - 11}, ${tone - 26})`;
    sCtx.fillRect(0, y, 512, 2);
  }
  sCtx.strokeStyle = 'rgba(92, 80, 66, 0.18)';
  sCtx.lineWidth = 1;
  for (let row = 0; row < 512; row += 128) {
    sCtx.beginPath();
    sCtx.moveTo(0, row);
    sCtx.lineTo(512, row);
    sCtx.stroke();
  }
  for (let col = 0; col < 512; col += 256) {
    sCtx.beginPath();
    sCtx.moveTo(col, 0);
    sCtx.lineTo(col, 512);
    sCtx.stroke();
  }

  const travertineColor = new THREE.CanvasTexture(stoneCanvas);
  travertineColor.colorSpace = THREE.SRGBColorSpace;
  travertineColor.wrapS = THREE.RepeatWrapping;
  travertineColor.wrapT = THREE.RepeatWrapping;
  travertineColor.repeat.set(2, 2);
  travertineColor.anisotropy = anisotropy;

  // Grayscale bump map
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 256;
  bumpCanvas.height = 256;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 650; i++) {
    const x = (i * 73) % 256;
    const y = (i * 137) % 256;
    const w = 6 + (i % 18);
    bCtx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.14)';
    bCtx.fillRect(x, y, w, 2);
  }
  const travertineBump = new THREE.CanvasTexture(bumpCanvas);
  travertineBump.wrapS = THREE.RepeatWrapping;
  travertineBump.wrapT = THREE.RepeatWrapping;
  travertineBump.repeat.set(3, 3);

  // 2. Warm Walnut Timber Grain
  const woodCanvas = document.createElement('canvas');
  woodCanvas.width = 256;
  woodCanvas.height = 256;
  const wCtx = woodCanvas.getContext('2d')!;
  wCtx.fillStyle = '#6B4930';
  wCtx.fillRect(0, 0, 256, 256);
  for (let x = 0; x < 256; x += 2) {
    const grain = Math.sin(x * 0.18) * 10 + Math.cos(x * 0.41) * 6;
    const r = Math.min(255, Math.max(0, Math.round(104 + grain)));
    const g = Math.min(255, Math.max(0, Math.round(70 + grain * 0.65)));
    const b = Math.min(255, Math.max(0, Math.round(45 + grain * 0.45)));
    wCtx.fillStyle = `rgb(${r},${g},${b})`;
    wCtx.fillRect(x, 0, 2, 256);
  }
  const timberColor = new THREE.CanvasTexture(woodCanvas);
  timberColor.colorSpace = THREE.SRGBColorSpace;
  timberColor.wrapS = THREE.RepeatWrapping;
  timberColor.wrapT = THREE.RepeatWrapping;
  timberColor.anisotropy = anisotropy;

  // 3. Courtyard Stone Paving Grid
  const courtCanvas = document.createElement('canvas');
  courtCanvas.width = 512;
  courtCanvas.height = 512;
  const cCtx = courtCanvas.getContext('2d')!;
  cCtx.fillStyle = '#CFC6B7';
  cCtx.fillRect(0, 0, 512, 512);
  cCtx.strokeStyle = 'rgba(72, 62, 52, 0.22)';
  cCtx.lineWidth = 2;
  for (let i = 0; i <= 512; i += 64) {
    cCtx.beginPath();
    cCtx.moveTo(i, 0);
    cCtx.lineTo(i, 512);
    cCtx.stroke();
    cCtx.beginPath();
    cCtx.moveTo(0, i);
    cCtx.lineTo(512, i);
    cCtx.stroke();
  }
  const courtyardColor = new THREE.CanvasTexture(courtCanvas);
  courtyardColor.colorSpace = THREE.SRGBColorSpace;
  courtyardColor.wrapS = THREE.RepeatWrapping;
  courtyardColor.wrapT = THREE.RepeatWrapping;
  courtyardColor.repeat.set(4, 4);
  courtyardColor.anisotropy = anisotropy;

  // 4. Soft Radial Contact Shadow Disc
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const shCtx = shadowCanvas.getContext('2d')!;
  const grad = shCtx.createRadialGradient(128, 128, 22, 128, 128, 124);
  grad.addColorStop(0, 'rgba(25, 20, 16, 0.55)');
  grad.addColorStop(0.65, 'rgba(25, 20, 16, 0.22)');
  grad.addColorStop(1, 'rgba(25, 20, 16, 0)');
  shCtx.fillStyle = grad;
  shCtx.fillRect(0, 0, 256, 256);
  const contactShadow = new THREE.CanvasTexture(shadowCanvas);

  return {
    travertineColor,
    travertineBump,
    timberColor,
    courtyardColor,
    contactShadow,
    dispose: () => {
      travertineColor.dispose();
      travertineBump.dispose();
      timberColor.dispose();
      courtyardColor.dispose();
      contactShadow.dispose();
    },
  };
}
