import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(
  cents: number,
  currency: string = "PKR",
  locale: string = "en-PK",
): string {
  const rupees = Math.round(cents / 10);
  return `Rs. ${rupees.toLocaleString("en-PK")}`;
}

