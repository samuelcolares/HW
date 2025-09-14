import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function randomNumberGenerator(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const maskCurrency = (value: string, includeCents: boolean = true) => {
  const digits = value.replace(/\D/g, "");

  if (!digits) return "";

  const numericValue = parseInt(digits);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: includeCents ? 2 : 0,
    maximumFractionDigits: includeCents ? 2 : 0,
  });

  const amount = includeCents ? numericValue / 100 : numericValue;

  return formatter.format(amount).replace("USD", "");
};
