import Image from "next/image";
import { mockupFor, type Product } from "@/lib/products";

type Props = {
  product: Product;
  colorId?: string;
  title: string;
  className?: string;
  priority?: boolean;
  cover?: boolean;
};

export function ProductMockup({
  product,
  colorId,
  title,
  className = "",
  priority = false,
  cover = false,
}: Props) {
  return (
    <Image
      src={mockupFor(product, colorId)}
      alt={title}
      width={900}
      height={1200}
      priority={priority}
      className={`${cover ? "h-full w-full object-cover" : "h-full w-full object-contain"} ${className}`}
    />
  );
}
