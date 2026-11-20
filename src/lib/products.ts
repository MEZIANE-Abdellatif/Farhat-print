export type ProductCategory = "tshirt" | "mug" | "bag" | "cap" | "jacket";
export type PrintSide = "front" | "back";

export type PrintArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ProductColor = {
  id: string;
  hex: string;
  mockup: string;
  blend?: "multiply" | "normal";
};

export type Product = {
  slug: string;
  category: ProductCategory;
  priceMad: number;
  sizes: string[];
  sides: PrintSide[];
  colors: ProductColor[];
  printAreas: Record<PrintSide, PrintArea>;
  featured?: boolean;
};

export const CATEGORIES: ProductCategory[] = [
  "tshirt",
  "mug",
  "bag",
  "cap",
  "jacket",
];

const TEE_AREA = { x: 0.36, y: 0.3, width: 0.28, height: 0.3 };

export const PRODUCTS: Product[] = [
  {
    slug: "t-shirt",
    category: "tshirt",
    priceMad: 149,
    featured: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    sides: ["front", "back"],
    colors: [
      { id: "white", hex: "#F8FAFC", mockup: "/mockups/tshirt-white.jpg", blend: "multiply" },
      { id: "black", hex: "#111827", mockup: "/mockups/tshirt-black.jpg" },
      { id: "navy", hex: "#1E3A5F", mockup: "/mockups/tshirt-navy.jpg" },
      { id: "royal", hex: "#2563EB", mockup: "/mockups/tshirt-navy.jpg" },
      { id: "red", hex: "#DC2626", mockup: "/mockups/tshirt-red.jpg" },
      { id: "heather", hex: "#9CA3AF", mockup: "/mockups/tshirt-white.jpg", blend: "multiply" },
    ],
    printAreas: { front: TEE_AREA, back: TEE_AREA },
  },
  {
    slug: "mug",
    category: "mug",
    priceMad: 79,
    featured: true,
    sizes: [],
    sides: ["front"],
    colors: [
      { id: "white", hex: "#FFFFFF", mockup: "/mockups/mug-white.jpg", blend: "multiply" },
      { id: "black", hex: "#1F2937", mockup: "/mockups/mug-magic.jpg" },
    ],
    printAreas: {
      front: { x: 0.26, y: 0.36, width: 0.34, height: 0.34 },
      back: { x: 0.26, y: 0.36, width: 0.34, height: 0.34 },
    },
  },
  {
    slug: "magic-mug",
    category: "mug",
    priceMad: 99,
    sizes: [],
    sides: ["front"],
    colors: [{ id: "black", hex: "#111827", mockup: "/mockups/mug-magic.jpg" }],
    printAreas: {
      front: { x: 0.26, y: 0.36, width: 0.34, height: 0.34 },
      back: { x: 0.26, y: 0.36, width: 0.34, height: 0.34 },
    },
  },
  {
    slug: "tote-bag",
    category: "bag",
    priceMad: 89,
    featured: true,
    sizes: [],
    sides: ["front"],
    colors: [
      { id: "natural", hex: "#F5E6C8", mockup: "/mockups/tote-natural.jpg", blend: "multiply" },
      { id: "white", hex: "#FFFFFF", mockup: "/mockups/tote-natural.jpg", blend: "multiply" },
      { id: "black", hex: "#1F2937", mockup: "/mockups/tote-black.jpg" },
    ],
    printAreas: {
      front: { x: 0.33, y: 0.4, width: 0.34, height: 0.34 },
      back: { x: 0.33, y: 0.4, width: 0.34, height: 0.34 },
    },
  },
  {
    slug: "cap",
    category: "cap",
    priceMad: 99,
    featured: true,
    sizes: ["Unique"],
    sides: ["front"],
    colors: [
      { id: "black", hex: "#111827", mockup: "/mockups/cap-black.jpg" },
      { id: "navy", hex: "#1E3A5F", mockup: "/mockups/cap-black.jpg" },
      { id: "red", hex: "#B91C1C", mockup: "/mockups/cap-black.jpg" },
      { id: "white", hex: "#F8FAFC", mockup: "/mockups/cap-white.jpg" },
    ],
    printAreas: {
      front: { x: 0.36, y: 0.26, width: 0.26, height: 0.2 },
      back: { x: 0.36, y: 0.26, width: 0.26, height: 0.2 },
    },
  },
  {
    slug: "jacket",
    category: "jacket",
    priceMad: 349,
    sizes: ["S", "M", "L", "XL", "XXL"],
    sides: ["front", "back"],
    colors: [
      { id: "navy", hex: "#1E3A5F", mockup: "/mockups/jacket-navy.jpg" },
      { id: "black", hex: "#111827", mockup: "/mockups/jacket-black.jpg" },
      { id: "red", hex: "#B91C1C", mockup: "/mockups/jacket-navy.jpg" },
    ],
    printAreas: {
      front: { x: 0.38, y: 0.32, width: 0.24, height: 0.2 },
      back: { x: 0.3, y: 0.28, width: 0.4, height: 0.38 },
    },
  },
  {
    slug: "hoodie",
    category: "jacket",
    priceMad: 249,
    featured: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    sides: ["front", "back"],
    colors: [
      { id: "white", hex: "#F8FAFC", mockup: "/mockups/hoodie-white.jpg", blend: "multiply" },
      { id: "black", hex: "#111827", mockup: "/mockups/hoodie-black.jpg" },
      { id: "navy", hex: "#1E3A5F", mockup: "/mockups/hoodie-black.jpg" },
      { id: "heather", hex: "#9CA3AF", mockup: "/mockups/hoodie-white.jpg" },
    ],
    printAreas: {
      front: { x: 0.3, y: 0.34, width: 0.4, height: 0.32 },
      back: { x: 0.3, y: 0.32, width: 0.4, height: 0.34 },
    },
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return PRODUCTS.filter((product) => product.category === category);
}

export function mockupFor(product: Product, colorId?: string): string {
  const match = product.colors.find((color) => color.id === colorId);
  return match?.mockup ?? product.colors[0]?.mockup ?? "/mockups/tshirt-white.jpg";
}

export function formatMad(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === "en" ? "en-MA" : "fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(amount);
}
