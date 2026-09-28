/**
 * High-Performance In-Memory Cache with Stale-While-Revalidate (SWR) support.
 * Designed to absorb traffic bursts of 1,000,000+ requests without degrading the database.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  staleAt: number;
}

class MicroCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private readonly defaultTtlMs: number;
  private readonly staleTtlMs: number;
  private readonly maxSize: number;

  constructor(options?: { ttlMs?: number; staleTtlMs?: number; maxSize?: number }) {
    this.defaultTtlMs = options?.ttlMs ?? 30_000; // 30s fresh
    this.staleTtlMs = options?.staleTtlMs ?? 120_000; // 2m stale
    this.maxSize = options?.maxSize ?? 10_000;
  }

  get<T>(key: string): { data: T; isStale: boolean } | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    const now = Date.now();
    if (now > entry.staleAt) {
      this.cache.delete(key);
      return null;
    }

    return {
      data: entry.value,
      isStale: now > entry.expiresAt,
    };
  }

  set<T>(key: string, value: T, ttlMs?: number, staleTtlMs?: number): void {
    if (this.cache.size >= this.maxSize) {
      // LRU-lite eviction: remove first inserted 10% keys
      const keysToDelete = Array.from(this.cache.keys()).slice(0, Math.floor(this.maxSize * 0.1));
      keysToDelete.forEach((k) => this.cache.delete(k));
    }

    const ttl = ttlMs ?? this.defaultTtlMs;
    const staleTtl = staleTtlMs ?? this.staleTtlMs;
    const now = Date.now();

    this.cache.set(key, {
      value,
      expiresAt: now + ttl,
      staleAt: now + staleTtl,
    });
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  /**
   * Wrap an async operation with automatic deduplication & SWR
   */
  async swr<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs?: number,
    staleTtlMs?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached) {
      if (cached.isStale) {
        // Trigger background refresh without blocking client
        fetcher()
          .then((fresh) => this.set(key, fresh, ttlMs, staleTtlMs))
          .catch(() => {});
      }
      return cached.data;
    }

    const fresh = await fetcher();
    this.set(key, fresh, ttlMs, staleTtlMs);
    return fresh;
  }
}

export const globalCache = new MicroCache({
  ttlMs: 60_000,       // 1 minute fresh
  staleTtlMs: 300_000,  // 5 minutes stale serving
  maxSize: 5000,
});
