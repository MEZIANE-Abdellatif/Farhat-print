export type ClipartItem = {
  id: string;
  src: string;
};

export const CLIPART: ClipartItem[] = [
  { id: "heart", src: "/clipart/heart.svg" },
  { id: "star", src: "/clipart/star.svg" },
  { id: "splash", src: "/clipart/splash.svg" },
  { id: "diamond", src: "/clipart/diamond.svg" },
  { id: "bolt", src: "/clipart/bolt.svg" },
];

export const TEMPLATES = [
  { id: "neon", text: "FARHAT", fill: "#22D3EE" },
  { id: "ideas", text: "GOOD IDEAS\nTAKE TIME", fill: "#2563EB" },
  { id: "rose", text: "Just a girl", fill: "#111827" },
  { id: "couple", text: "♥", fill: "#E11D48" },
] as const;
