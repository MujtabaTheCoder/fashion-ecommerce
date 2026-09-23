"use server";

import { NotImplementedError } from "@/lib/errors";

export async function saveProduct(): Promise<never> {
  throw new NotImplementedError("Admin mutations");
}
