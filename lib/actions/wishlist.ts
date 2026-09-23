"use server";

import { NotImplementedError } from "@/lib/errors";

export async function toggleWishlist(productId: string): Promise<never> {
  void productId;
  throw new NotImplementedError("Wishlist mutations");
}
