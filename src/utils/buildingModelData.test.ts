import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ARCHITECTURAL_ZONES,
  dampScalar,
  findZoneById,
} from './buildingModelData';

test('findZoneById retrieves defined architectural zones cleanly', () => {
  assert.equal(findZoneById(null), undefined);
  assert.equal(findZoneById('non-existent'), undefined);
  const bedroom = findZoneById('bedroom-suite');
  assert.ok(bedroom);
  assert.equal(bedroom.projectId, 'walnut-stone-suite');
  assert.equal(ARCHITECTURAL_ZONES.length, 5);
});

test('dampScalar moves smoothly toward target without overshooting', () => {
  const step1 = dampScalar(0, 10, 6, 0.016);
  assert.ok(step1 > 0 && step1 < 10);
  const settled = dampScalar(0, 10, 6, 10);
  assert.ok(Math.abs(settled - 10) < 0.0001);
});
