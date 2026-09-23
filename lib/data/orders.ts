import { NotImplementedError } from "@/lib/errors";

export async function listOrdersForUser(userId: string): Promise<never> {
  void userId;
  throw new NotImplementedError("Order reads");
}
