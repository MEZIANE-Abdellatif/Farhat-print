export const SITE_NAME = "FARHAT PRINT";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://farhatprint.ma";

export const CONTACT = {
  phoneDisplay: "06 04 56 97 25",
  phoneTel: "+212604569725",
  whatsappE164: "212604569725",
  email: "farhat.print23@gmail.com",
  instagram: "farhat.print",
  instagramUrl: "https://www.instagram.com/farhat.print/",
  facebook: "farhat print",
  facebookUrl: "https://www.facebook.com/farhatprint",
} as const;

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
] as const;
