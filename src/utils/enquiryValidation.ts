export interface EnquiryFormValues {
  name: string;
  contact: string;
  projectType: string;
  location: string;
  message: string;
}

export interface EnquiryFormErrors {
  name?: string;
  contact?: string;
  projectType?: string;
  message?: string;
}

export const PROJECT_TYPES = [
  'Architecture & Architectural Planning',
  'Residential Interior Design',
  'Commercial & Office Interiors',
  'Home Renovations & Space Planning',
  'Landscape Planning & Courtyards',
  'Custom Joinery & 3D Visualisation',
] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_DIGITS_PATTERN = /^\+?[\d\s()-]{7,18}$/;

export function isValidContactInfo(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return false;
  if (trimmed.includes('@')) {
    return EMAIL_PATTERN.test(trimmed);
  }
  const digitsOnly = trimmed.replace(/\D/g, '');
  return PHONE_DIGITS_PATTERN.test(trimmed) && digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

export function validateEnquiryForm(values: EnquiryFormValues): EnquiryFormErrors {
  const errors: EnquiryFormErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = 'Please enter your full name.';
  }

  if (!isValidContactInfo(values.contact)) {
    errors.contact = 'Enter a valid 10-digit phone number or email address.';
  }

  if (!values.projectType.trim()) {
    errors.projectType = 'Please select a project discipline.';
  }

  if (values.message.trim().length < 10) {
    errors.message = 'Share a brief note about your space or timeline (at least 10 characters).';
  }

  return errors;
}

export function hasEnquiryErrors(errors: EnquiryFormErrors): boolean {
  return Object.values(errors).some((val) => typeof val === 'string' && val.length > 0);
}

export function buildWhatsAppEnquiryUrl(
  values: EnquiryFormValues,
  whatsappNumber = '917389934877',
): string {
  const lines = [
    `Hello Shakyawar Design Studio,`,
    `Name: ${values.name.trim()}`,
    `Contact: ${values.contact.trim()}`,
    `Project Type: ${values.projectType.trim()}`,
    values.location.trim() ? `Location: ${values.location.trim()}` : null,
    `Brief: ${values.message.trim()}`,
  ].filter(Boolean);

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
}
