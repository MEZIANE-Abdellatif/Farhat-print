import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from "@/lib/site";

export function validateImageFile(
  file: File,
  messages: { type: string; size: string },
): string | null {
  const allowed = ACCEPTED_IMAGE_TYPES as readonly string[];
  if (!allowed.includes(file.type)) return messages.type;
  if (file.size > MAX_UPLOAD_BYTES) return messages.size;
  return null;
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.rel = "noopener";
  link.click();
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("image"));
    image.src = src;
  });
}
