import { NotImplementedError } from "@/lib/errors";

export async function signInWithPassword(
  email: string,
  password: string,
): Promise<never> {
  void email;
  void password;
  throw new NotImplementedError("Auth");
}
