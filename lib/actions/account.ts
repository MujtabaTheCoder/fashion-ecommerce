"use server";

import { NotImplementedError } from "@/lib/errors";

export async function updateProfile(): Promise<never> {
  throw new NotImplementedError("Account mutations");
}
