import type { GuestCartLine } from "@/types";
import { NotImplementedError } from "@/lib/errors";

export const GUEST_CART_COOKIE = "atelier_cart";

export function readGuestCart(): GuestCartLine[] {
  throw new NotImplementedError("Guest cart cookie");
}

export function writeGuestCart(lines: GuestCartLine[]): void {
  void lines;
  throw new NotImplementedError("Guest cart cookie");
}
