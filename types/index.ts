import type { Enums, Tables } from "./database";

export type { Database, Enums, Json, Tables } from "./database";

export type Profile = Tables<"profiles">;
export type Category = Tables<"categories">;
export type Product = Tables<"products">;
export type ProductImage = Tables<"product_images">;
export type ProductVariant = Tables<"product_variants">;
export type Address = Tables<"addresses">;
export type CartItem = Tables<"cart_items">;
export type WishlistItem = Tables<"wishlists">;
export type Order = Tables<"orders">;
export type OrderItem = Tables<"order_items">;

export type UserRole = Enums<"user_role">;
export type ProductStatus = Enums<"product_status">;

export type GuestCartLine = {
  variantId: string;
  quantity: number;
};

export type ProductCardImage = {
  src: string;
  alt: string;
};

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  priceCents: number | null;
  compareAtCents: number | null;
  image: ProductCardImage | null;
};
