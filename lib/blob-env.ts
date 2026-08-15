export function getBlobToken() {
  return process.env.IMAGES_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
}

export function getBlobStoreId() {
  return process.env.IMAGES_STORE_ID || process.env.BLOB_STORE_ID;
}

export function blobAuth() {
  const token = getBlobToken();
  const storeId = getBlobStoreId();
  return {
    ...(token ? { token } : {}),
    ...(storeId ? { storeId } : {}),
  };
}

export function isBlobStorageEnabled() {
  return Boolean(getBlobToken());
}
