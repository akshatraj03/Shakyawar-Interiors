import { FormEvent, useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Star,
} from 'lucide-react';
import { STUDIO_INFO } from '../data/studioData';
import {
  buildWhatsAppEnquiryUrl,
  EnquiryFormErrors,
  EnquiryFormValues,
  hasEnquiryErrors,
  PROJECT_TYPES,
  validateEnquiryForm,
} from '../utils/enquiryValidation';
import { Reveal } from './RevealSection';

interface TrustAndContactProps {
  preselectedDiscipline?: string;
}

function resolveProjectTypeMatch(raw: string): string | undefined {
  const exact = PROJECT_TYPES.find((t) => t.toLowerCase() === raw.trim().toLowerCase());
  if (exact) return exact;

  const lower = raw.toLowerCase();
  if (lower.includes('commercial') || lower.includes('office')) {
    return 'Commercial & Office Interiors';
  }
  if (lower.includes('renovation') || lower.includes('space planning')) {
    return 'Home Renovations & Space Planning';
  }
  if (lower.includes('landscape') || lower.includes('courtyard')) {
    return 'Landscape Planning & Courtyards';
  }
  if (lower.includes('joinery') || lower.includes('3d')) {
    return 'Custom Joinery & 3D Visualisation';
  }
  if (lower.includes('interior')) {
    return 'Residential Interior Design';
  }
  if (lower.includes('architecture') || lower.includes('planning')) {
    return 'Architecture & Architectural Planning';
  }
  return undefined;
}

export function TrustAndContact({ preselectedDiscipline }: TrustAndContactProps) {
  const [values, setValues] = useState<EnquiryFormValues>({
    name: '',
    contact: '',
    projectType: PROJECT_TYPES[0],
    location: '',
    message: '',
  });
  const [errors, setErrors] = useState<EnquiryFormErrors>({});
  const [submittedRecord, setSubmittedRecord] = useState<EnquiryFormValues | null>(null);

  useEffect(() => {
    if (!preselectedDiscipline) return;
    const match = resolveProjectTypeMatch(preselectedDiscipline);
    if (match) {
      setValues((prev) => ({ ...prev, projectType: match }));
      setSubmittedRecord(null);
    }
  }, [preselectedDiscipline]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateEnquiryForm(values);
    setErrors(validation);
    if (hasEnquiryErrors(validation)) return;
    setSubmittedRecord({ ...values });
  };

  const handleReset = () => {
    setSubmittedRecord(null);
    setErrors({});
    setValues({
      name: '',
      contact: '',
      projectType: PROJECT_TYPES[0],
      location: '',
      message: '',
    });
  };

  return (
    <>
      {/* Verified Multi-Platform Studio Standing & Indore Office Band */}
      <section
        aria-label="Verified Business Profile and Client Ratings"
        className="border-t border-[#D9D1C5] bg-[#F2EFE9] text-[#29241F]"
      >
        <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-12 md:py-24">
          <Reveal>
            <div className="flex flex-col gap-6 border-b border-[#D9D1C5] pb-10 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#92795F]">
                  Verified Studio Standing · {STUDIO_INFO.locationShort}
                </p>
                <h2 className="mt-3 font-serif text-3xl font-medium leading-[1.1] text-[#29241F] sm:text-4xl">
                  Consistent client trust across public directories.
                </h2>
              </div>
              <p className="text-xs font-medium tracking-[0.14em] uppercase text-[#6B6257]">
                Principal Architect: {STUDIO_INFO.principalArchitect} · {STUDIO_INFO.establishedNote}
              </p>
            </div>
          </Reveal>

          {/* Verified 3-Platform Rating Readout */}
          <Reveal delayMs={80}>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {STUDIO_INFO.platformRatings.map((item) => (
                <div
                  key={item.platform}
                  className="border border-[#D9D1C5] bg-[#EAE4DA]/50 p-6 sm:p-7"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-medium tracking-[0.16em] uppercase text-[#6B6257]">
                      {item.platform}
                    </span>
                    <div
                      className="flex items-center gap-0.5 text-[#92795F]"
                      aria-label={`${item.rating} out of 5 stars on ${item.platform}`}
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="font-serif text-4xl font-medium tabular-nums text-[#29241F]">
                      {item.rating}
                    </span>
                    <span className="text-xs font-medium text-[#4E473F]">
                      based on {item.volume}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Indore Studio Office Details Grid */}
          <Reveal delayMs={140}>
            <div className="mt-10 grid grid-cols-1 gap-8 border-t border-[#D9D1C5] pt-10 sm:grid-cols-3">
              <div>
                <p className="flex items-center gap-2 text-xs font-medium tracking-[0.14em] uppercase text-[#92795F]">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  Studio Address
                </p>
                <p className="mt-2.5 text-sm leading-relaxed text-[#29241F]">
                  {STUDIO_INFO.address}
                </p>
                <a
                  href={STUDIO_INFO.mapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.1em] uppercase text-[#29241F] underline decoration-[#92795F] underline-offset-4 hover:text-[#92795F]"
                >
                  Google Maps Directions
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>

              <div>
                <p className="flex items-center gap-2 text-xs font-medium tracking-[0.14em] uppercase text-[#92795F]">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  Studio Hours
                </p>
                <p className="mt-2.5 text-sm leading-relaxed text-[#29241F]">
                  {STUDIO_INFO.hours}
                </p>
                <p className="mt-1 text-xs text-[#6B6257]">
                  {STUDIO_INFO.sundayNote}
                </p>
              </div>

              <div>
                <p className="flex items-center gap-2 text-xs font-medium tracking-[0.14em] uppercase text-[#92795F]">
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  Direct Studio Desk
                </p>
                <a
                  href={STUDIO_INFO.phoneHref}
                  className="mt-2.5 block text-sm font-medium tabular-nums text-[#29241F] hover:text-[#92795F]"
                >
                  {STUDIO_INFO.phoneDisplay}
                </a>
                <p className="mt-1 text-xs tabular-nums text-[#6B6257]">
                  {STUDIO_INFO.secondaryPhones.join(' · ')}
                </p>
                <a
                  href={`mailto:${STUDIO_INFO.email}`}
                  className="mt-2 block break-all text-xs font-medium text-[#4E473F] hover:text-[#29241F]"
                >
                  {STUDIO_INFO.email}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact & Project Enquiry Section */}
      <section
        id="contact"
        aria-label="Contact Shakyawar Design Studio"
        className="scroll-mt-20 border-t border-[#D9D1C5] bg-[#EAE4DA] text-[#29241F]"
      >
        <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-28">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
            {/* Left Editorial Contact Details & WhatsApp Direct Action */}
            <Reveal className="flex flex-col justify-between lg:col-span-5">
              <div>
                <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#92795F]">
                  Start a Conversation
                </p>
                <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.06] text-[#29241F] sm:text-5xl">
                  Have a space in mind?
                </h2>
                <p className="mt-4 font-serif text-2xl italic text-[#4E473F]">
                  Let&apos;s explore what it could become.
                </p>
                <p className="mt-6 max-w-md text-sm leading-relaxed text-[#4E473F]">
                  Share your site location, approximate scope, or renovation goals. Speak directly with Principal Architect {STUDIO_INFO.principalArchitect}&apos;s team in Indore or initiate a brief on WhatsApp.
                </p>

                {/* Primary Direct WhatsApp Consultation CTA */}
                <div className="mt-8">
                  <a
                    href={STUDIO_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2.5 bg-[#29241F] px-6 py-3.5 text-xs font-semibold tracking-[0.14em] uppercase text-[#F2EFE9] transition-colors hover:bg-[#5D432C]"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    WhatsApp Consultation
                    <ExternalLink className="h-3.5 w-3.5 opacity-75" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="mt-10 space-y-5 border-t border-[#CFC6B8] pt-8 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#92795F]" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#6B6257]">
                      Studio Address
                    </p>
                    <p className="mt-1 text-[#29241F]">{STUDIO_INFO.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#92795F]" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#6B6257]">
                      Telephone &amp; Mobile
                    </p>
                    <a
                      href={STUDIO_INFO.phoneHref}
                      className="mt-1 inline-block font-medium tabular-nums text-[#29241F] hover:text-[#92795F]"
                    >
                      {STUDIO_INFO.phoneDisplay}
                    </a>
                    <p className="mt-0.5 text-xs tabular-nums text-[#4E473F]">
                      {STUDIO_INFO.secondaryPhones.join(' · ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#92795F]" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#6B6257]">
                      Direct Email
                    </p>
                    <a
                      href={`mailto:${STUDIO_INFO.email}`}
                      className="mt-1 inline-block font-medium text-[#29241F] hover:text-[#92795F]"
                    >
                      {STUDIO_INFO.email}
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Right Project Enquiry Form */}
            <Reveal delayMs={100} className="lg:col-span-7">
              <div className="border border-[#CFC6B8] bg-[#F2EFE9] p-6 sm:p-10">
                {submittedRecord ? (
                  <div
                    role="status"
                    className="flex flex-col items-start py-4"
                  >
                    <CheckCircle2 className="h-8 w-8 text-[#92795F]" aria-hidden="true" />
                    <h3 className="mt-4 font-serif text-3xl font-medium text-[#29241F]">
                      Project Brief Ready, {submittedRecord.name}.
                    </h3>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-[#4E473F]">
                      Your enquiry for <strong className="font-medium text-[#29241F]">{submittedRecord.projectType}</strong> has been validated and formatted locally. Select WhatsApp or your email app below to send it directly to Shakyawar Design Studio.
                    </p>

                    <div className="mt-6 w-full space-y-1.5 border-t border-[#D9D1C5] pt-5 text-xs text-[#4E473F]">
                      <p>
                        <span className="font-medium text-[#29241F]">Contact:</span>{' '}
                        {submittedRecord.contact}
                      </p>
                      {submittedRecord.location && (
                        <p>
                          <span className="font-medium text-[#29241F]">Site Location:</span>{' '}
                          {submittedRecord.location}
                        </p>
                      )}
                      <p>
                        <span className="font-medium text-[#29241F]">Scope Notes:</span>{' '}
                        {submittedRecord.message}
                      </p>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <a
                        href={buildWhatsAppEnquiryUrl(
                          submittedRecord,
                          STUDIO_INFO.whatsappNumber,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] items-center gap-2 bg-[#29241F] px-6 py-3 text-xs font-semibold tracking-[0.14em] uppercase text-[#F2EFE9] transition-colors hover:bg-[#5D432C]"
                      >
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                        Send via WhatsApp
                      </a>
                      <a
                        href={`mailto:${STUDIO_INFO.email}?subject=${encodeURIComponent(
                          `Project Enquiry: ${submittedRecord.projectType} — ${submittedRecord.name}`,
                        )}&body=${encodeURIComponent(
                          `Name: ${submittedRecord.name}\nContact: ${submittedRecord.contact}\nDiscipline: ${submittedRecord.projectType}\nLocation: ${submittedRecord.location || 'Indore'}\n\nBrief:\n${submittedRecord.message}`,
                        )}`}
                        className="inline-flex min-h-[44px] items-center border border-[#29241F] px-5 py-3 text-xs font-semibold tracking-[0.12em] uppercase text-[#29241F] transition-colors hover:bg-[#29241F] hover:text-[#F2EFE9]"
                      >
                        Open in Email App
                      </a>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="min-h-[44px] px-4 py-3 text-xs font-medium tracking-[0.12em] uppercase text-[#6B6257] underline underline-offset-4 hover:text-[#29241F]"
                      >
                        New Enquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    <div className="border-b border-[#D9D1C5] pb-4">
                      <p className="text-xs font-medium tracking-[0.16em] uppercase text-[#92795F]">
                        Project Brief
                      </p>
                      <p className="mt-1 text-xs text-[#6B6257]">
                        Prepare your scope notes to dispatch directly via WhatsApp or Email.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="enquiry-name"
                          className="block text-xs font-medium tracking-[0.14em] uppercase text-[#4E473F]"
                        >
                          Full Name
                        </label>
                        <input
                          id="enquiry-name"
                          name="name"
                          type="text"
                          value={values.name}
                          onChange={(e) =>
                            setValues((prev) => ({ ...prev, name: e.target.value }))
                          }
                          placeholder="Your name"
                          className="mt-2 w-full border border-[#CFC6B8] bg-white/75 px-4 py-3 text-sm text-[#29241F] placeholder:text-[#8E8477] focus:border-[#29241F] focus:outline-none"
                        />
                        {errors.name && (
                          <p className="mt-1.5 text-xs text-[#8C3B2B]">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="enquiry-contact"
                          className="block text-xs font-medium tracking-[0.14em] uppercase text-[#4E473F]"
                        >
                          Phone or Email
                        </label>
                        <input
                          id="enquiry-contact"
                          name="contact"
                          type="text"
                          value={values.contact}
                          onChange={(e) =>
                            setValues((prev) => ({ ...prev, contact: e.target.value }))
                          }
                          placeholder="+91 ... or you@domain.com"
                          className="mt-2 w-full border border-[#CFC6B8] bg-white/75 px-4 py-3 text-sm text-[#29241F] placeholder:text-[#8E8477] focus:border-[#29241F] focus:outline-none"
                        />
                        {errors.contact && (
                          <p className="mt-1.5 text-xs text-[#8C3B2B]">{errors.contact}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="enquiry-type"
                          className="block text-xs font-medium tracking-[0.14em] uppercase text-[#4E473F]"
                        >
                          Project Discipline
                        </label>
                        <select
                          id="enquiry-type"
                          name="projectType"
                          value={values.projectType}
                          onChange={(e) =>
                            setValues((prev) => ({ ...prev, projectType: e.target.value }))
                          }
                          className="mt-2 w-full border border-[#CFC6B8] bg-white/75 px-4 py-3 text-sm text-[#29241F] focus:border-[#29241F] focus:outline-none"
                        >
                          {PROJECT_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        {errors.projectType && (
                          <p className="mt-1.5 text-xs text-[#8C3B2B]">{errors.projectType}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="enquiry-location"
                          className="block text-xs font-medium tracking-[0.14em] uppercase text-[#4E473F]"
                        >
                          Site Location (Optional)
                        </label>
                        <input
                          id="enquiry-location"
                          name="location"
                          type="text"
                          value={values.location}
                          onChange={(e) =>
                            setValues((prev) => ({ ...prev, location: e.target.value }))
                          }
                          placeholder="e.g. Bicholi Hapsi, Indore"
                          className="mt-2 w-full border border-[#CFC6B8] bg-white/75 px-4 py-3 text-sm text-[#29241F] placeholder:text-[#8E8477] focus:border-[#29241F] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="enquiry-message"
                        className="block text-xs font-medium tracking-[0.14em] uppercase text-[#4E473F]"
                      >
                        About Your Space
                      </label>
                      <textarea
                        id="enquiry-message"
                        name="message"
                        rows={4}
                        value={values.message}
                        onChange={(e) =>
                          setValues((prev) => ({ ...prev, message: e.target.value }))
                        }
                        placeholder="Describe your space, approximate area, and what you are looking to transform..."
                        className="mt-2 w-full border border-[#CFC6B8] bg-white/75 px-4 py-3 text-sm text-[#29241F] placeholder:text-[#8E8477] focus:border-[#29241F] focus:outline-none"
                      />
                      {errors.message && (
                        <p className="mt-1.5 text-xs text-[#8C3B2B]">{errors.message}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="submit"
                        className="min-h-[44px] bg-[#29241F] px-7 py-3.5 text-xs font-semibold tracking-[0.14em] uppercase text-[#F2EFE9] transition-colors duration-200 hover:bg-[#34302B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#92795F]"
                      >
                        Prepare Project Enquiry
                      </button>
                      <span className="text-xs tabular-nums text-[#6B6257]">
                        Or call {STUDIO_INFO.phoneDisplay}
                      </span>
                    </div>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
