const MIN_SECRET_LENGTH = 32;

export function getAuthSecret(): Uint8Array {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < MIN_SECRET_LENGTH) {
    throw new Error(`AUTH_SECRET must be set and at least ${MIN_SECRET_LENGTH} characters long.`);
  }
  return new TextEncoder().encode(value);
}
