import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWhatsAppEnquiryUrl,
  hasEnquiryErrors,
  isValidContactInfo,
  PROJECT_TYPES,
  validateEnquiryForm,
} from './enquiryValidation';

test('isValidContactInfo validates email and Indian/international phone strings', () => {
  assert.equal(isValidContactInfo('client@example.com'), true);
  assert.equal(isValidContactInfo('+91 73899 34877'), true);
  assert.equal(isValidContactInfo('9826012345'), true);
  assert.equal(isValidContactInfo('12345'), false);
  assert.equal(isValidContactInfo('bad@'), false);
  assert.equal(isValidContactInfo(''), false);
});

test('validateEnquiryForm flags missing fields and accepts complete submissions', () => {
  const invalidErrors = validateEnquiryForm({
    name: 'A',
    contact: 'invalid',
    projectType: '',
    location: '',
    message: 'Too short',
  });
  assert.equal(hasEnquiryErrors(invalidErrors), true);
  assert.ok(invalidErrors.name);
  assert.ok(invalidErrors.contact);
  assert.ok(invalidErrors.projectType);
  assert.ok(invalidErrors.message);

  const validErrors = validateEnquiryForm({
    name: 'Aarav Mehta',
    contact: '+91 98260 55443',
    projectType: PROJECT_TYPES[1],
    location: 'Vijay Nagar, Indore',
    message: 'Looking to design interiors for a 3BHK apartment in Indore.',
  });
  assert.equal(hasEnquiryErrors(validErrors), false);
});

test('buildWhatsAppEnquiryUrl formats encoded message targeting Shakyawar WhatsApp', () => {
  const url = buildWhatsAppEnquiryUrl({
    name: 'Rohan Sharma',
    contact: '+91 98260 11223',
    projectType: PROJECT_TYPES[0],
    location: 'Bicholi Hapsi, Indore',
    message: 'Ground-up residential planning on a 2400 sq ft plot.',
  });
  assert.ok(url.startsWith('https://wa.me/917389934877?text='));
  assert.ok(url.includes(encodeURIComponent('Rohan Sharma')));
  assert.ok(url.includes(encodeURIComponent('Bicholi Hapsi, Indore')));
});
