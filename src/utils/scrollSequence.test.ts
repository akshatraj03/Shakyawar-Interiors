import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildFrameUrl,
  clampProgress,
  computeCoverRect,
  findNearestLoadedFrame,
  getTransformationStage,
  progressToFrameIndex,
  TOTAL_HERO_FRAMES,
} from './scrollSequence';

test('clampProgress keeps values within [0, 1] and handles non-finite inputs', () => {
  assert.equal(clampProgress(-0.5), 0);
  assert.equal(clampProgress(0.42), 0.42);
  assert.equal(clampProgress(1.8), 1);
  assert.equal(clampProgress(Number.NaN), 0);
});

test('progressToFrameIndex maps progress evenly across 120 frames', () => {
  assert.equal(progressToFrameIndex(0), 0);
  assert.equal(progressToFrameIndex(1), TOTAL_HERO_FRAMES - 1);
  assert.equal(progressToFrameIndex(0.5), 60);
});

test('buildFrameUrl zero-pads 1-based frame URLs cleanly', () => {
  assert.equal(buildFrameUrl(0), '/hero-frames/frame_001.webp');
  assert.equal(buildFrameUrl(9), '/hero-frames/frame_010.webp');
  assert.equal(buildFrameUrl(119), '/hero-frames/frame_120.webp');
  assert.equal(buildFrameUrl(999), '/hero-frames/frame_120.webp');
});

test('getTransformationStage returns expected narrative stage along scroll progress', () => {
  assert.equal(getTransformationStage(0).id, 'raw-shell');
  assert.equal(getTransformationStage(0.25).id, 'millwork-ceiling');
  assert.equal(getTransformationStage(0.48).id, 'surfaces-joinery');
  assert.equal(getTransformationStage(0.70).id, 'furnishing-light');
  assert.equal(getTransformationStage(0.95).id, 'final-reveal');
});

test('computeCoverRect fills viewport while preserving aspect ratio', () => {
  const tallViewport = computeCoverRect(1280, 720, 390, 844);
  assert.equal(tallViewport.drawHeight, 844);
  assert.ok(tallViewport.drawWidth > 390);
  assert.ok(tallViewport.drawX < 0);

  const wideViewport = computeCoverRect(1280, 720, 1920, 900);
  assert.equal(wideViewport.drawWidth, 1920);
  assert.ok(wideViewport.drawHeight > 900);
  assert.ok(wideViewport.drawY < 0);
});

test('findNearestLoadedFrame resolves closest available cached frame', () => {
  const flags = [true, false, false, true, false];
  assert.equal(findNearestLoadedFrame(2, flags), 3);
  assert.equal(findNearestLoadedFrame(1, flags), 0);
  assert.equal(findNearestLoadedFrame(3, flags), 3);
});
