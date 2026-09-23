"use server";

import { NotImplementedError } from "@/lib/errors";

export async function placeOrder(): Promise<never> {
  throw new NotImplementedError("Checkout");
}
