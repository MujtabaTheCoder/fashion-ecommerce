import { NotImplementedError } from "@/lib/errors";

export async function mergeGuestCartIntoUser(userId: string): Promise<never> {
  void userId;
  throw new NotImplementedError("Guest cart merge");
}
