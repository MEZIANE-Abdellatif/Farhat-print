import type { PrintSide } from "@/lib/products";

export type CartItem = {
  id: string;
  productSlug: string;
  productName: string;
  colorId: string;
  colorName: string;
  colorHex: string;
  size: string | null;
  quantity: number;
  side: PrintSide;
  priceMad: number;
  previewDataUrl: string;
};

export const CART_STORAGE_KEY = "farhat-print-cart";
