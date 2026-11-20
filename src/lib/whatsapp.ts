import { CONTACT } from "@/lib/site";
import type { CartItem } from "@/lib/cart-types";

export function whatsappUrl(text: string): string {
  return `https://wa.me/${CONTACT.whatsappE164}?text=${encodeURIComponent(text)}`;
}

export function buildOrderMessage(
  items: CartItem[],
  totalLabel: string,
  locale: string,
): string {
  const lines = items.map((item, index) => {
    const size = item.size ? ` | ${item.size}` : "";
    return `${index + 1}. ${item.productName} | ${item.colorName}${size} | x${item.quantity} | ${item.side} | ${item.priceMad} MAD`;
  });
  return [
    `FARHAT PRINT — commande (${locale})`,
    ...lines,
    `Total: ${totalLabel}`,
    "",
    "Je joins l’aperçu téléchargé.",
  ].join("\n");
}
