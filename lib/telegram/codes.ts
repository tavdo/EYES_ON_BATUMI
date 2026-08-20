import { customAlphabet } from "nanoid";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const nano = customAlphabet(alphabet, 8);

export function generatePhotoCode() {
  return nano();
}

export function isPhotoCode(value: string) {
  return /^[A-HJ-NP-Z2-9]{8}$/i.test(value.trim());
}

export function normalizePhotoCode(value: string) {
  return value.trim().toUpperCase();
}
