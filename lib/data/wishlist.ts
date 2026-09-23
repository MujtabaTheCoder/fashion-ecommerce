import { NotImplementedError } from "@/lib/errors";

export async function listWishlistForUser(userId: string): Promise<never> {
  void userId;
  throw new NotImplementedError("Wishlist reads");
}
