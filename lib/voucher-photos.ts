const POOL = [
  "/voucher/strip-1.jpg",
  "/voucher/strip-2.jpg",
  "/voucher/strip-3.jpg",
  "/voucher/strip-4.jpg",
  "/voucher/strip-5.jpg",
  "/voucher/strip-6.jpg",
  "/voucher/strip-7.jpg",
  "/voucher/strip-8.jpg",
] as const;

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function voucherStripPhotos(seed = "EOB") {
  const items = [...POOL];
  let state = hashSeed(seed);
  for (let index = items.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swap = state % (index + 1);
    const current = items[index]!;
    items[index] = items[swap]!;
    items[swap] = current;
  }
  return items.slice(0, 6);
}
