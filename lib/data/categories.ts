import { NotImplementedError } from "@/lib/errors";

export async function listActiveCategories(): Promise<never> {
  throw new NotImplementedError("Category reads");
}
