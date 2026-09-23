import { NotImplementedError } from "@/lib/errors";

export async function getCartForUser(userId: string): Promise<never> {
  void userId;
  throw new NotImplementedError("Cart reads");
}
