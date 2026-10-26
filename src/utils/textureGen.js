import * as THREE from "three";

/**
 * Generates procedural high-resolution canvas textures for Three.js particles.
 * Eliminates ugly square points and gives realistic glowing stellar coronas.
 */

// Cached textures
let starTexture = null;
let glowTexture = null;
let dustTexture = null;
let ringTexture = null;

export function getStarTexture() {
  if (starTexture) return starTexture;

  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1.0)");
  gradient.addColorStop(0.1, "rgba(240, 248, 255, 0.95)");
  gradient.addColorStop(0.25, "rgba(180, 220, 255, 0.6)");
  gradient.addColorStop(0.5, "rgba(100, 150, 255, 0.2)");
  gradient.addColorStop(0.8, "rgba(60, 40, 140, 0.05)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  // Subtle star diffraction spikes
  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(64, 20);
  ctx.lineTo(64, 108);
  ctx.moveTo(20, 64);
  ctx.lineTo(108, 64);
  ctx.stroke();

  starTexture = new THREE.CanvasTexture(canvas);
  starTexture.generateMipmaps = true;
  return starTexture;
}

export function getGlowTexture() {
  if (glowTexture) return glowTexture;

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
  gradient.addColorStop(0.2, "rgba(199, 125, 255, 0.45)");
  gradient.addColorStop(0.45, "rgba(157, 78, 221, 0.2)");
  gradient.addColorStop(0.7, "rgba(0, 245, 212, 0.06)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  glowTexture = new THREE.CanvasTexture(canvas);
  return glowTexture;
}

export function getDustTexture() {
  if (dustTexture) return dustTexture;

  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(200, 180, 255, 0.6)");
  gradient.addColorStop(0.4, "rgba(100, 80, 180, 0.2)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  dustTexture = new THREE.CanvasTexture(canvas);
  return dustTexture;
}

export function getRingTexture() {
  if (ringTexture) return ringTexture;

  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");

  ctx.strokeStyle = "rgba(0, 245, 212, 0.8)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(64, 64, 52, 0, Math.PI * 2);
  ctx.stroke();

  ringTexture = new THREE.CanvasTexture(canvas);
  return ringTexture;
}
