export const refreshCacheAndReload = async (): Promise<void> => {
  try {
    if (caches) {
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        caches.delete(cacheName);
      }
      window.location.reload();
    }
  } catch (error) {
    throw new Error(error);
  }
};
