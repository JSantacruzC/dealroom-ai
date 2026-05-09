export interface PasswordCheck {
  minLength: boolean;
  upper: boolean;
  lower: boolean;
  number: boolean;
  special: boolean;
}

export function checkPassword(pw: string): PasswordCheck {
  return {
    minLength: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };
}

export function isPasswordValid(pw: string): boolean {
  const c = checkPassword(pw);
  return c.minLength && c.upper && c.lower && c.number && c.special;
}

export type PasswordStrength = "empty" | "weak" | "medium" | "strong";

export function passwordStrength(pw: string): PasswordStrength {
  if (!pw) return "empty";
  const c = checkPassword(pw);
  const score = Object.values(c).filter(Boolean).length + (pw.length >= 12 ? 1 : 0);
  if (score <= 2) return "weak";
  if (score <= 4) return "medium";
  return "strong";
}

export function sanitize(input: string, max = 320): string {
  return input.trim().slice(0, max);
}
