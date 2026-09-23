"use server";

import { NotImplementedError } from "@/lib/errors";

export async function addToCart(variantId: string, quantity: number): Promise<never> {
  void variantId;
  void quantity;
  throw new NotImplementedError("Cart mutations");
}
