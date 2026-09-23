import { NotImplementedError } from "@/lib/errors";

export async function listAdminProducts(): Promise<never> {
  throw new NotImplementedError("Admin product reads");
}
