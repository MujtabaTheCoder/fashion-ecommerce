/**
 * High-concurrency sliding window rate limiter.
 * Protects mutation and search endpoints from denial of service.
 */

interface RateLimitRecord {
  timestamps: number[];
}

export class SlidingWindowRateLimiter {
  private store = new Map<string, RateLimitRecord>();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60_000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;

    // Periodic sweep to prevent memory leak
    if (typeof setInterval !== "undefined") {
      setInterval(() => this.cleanup(), 60_000).unref?.();
    }
  }

  check(identifier: string): { success: boolean; remaining: number; resetMs: number } {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    let record = this.store.get(identifier);
    if (!record) {
      record = { timestamps: [] };
      this.store.set(identifier, record);
    }

    // Filter out expired timestamps
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (record.timestamps.length >= this.maxRequests) {
      const oldest = record.timestamps[0] ?? now;
      const resetMs = Math.max(0, oldest + this.windowMs - now);
      return { success: false, remaining: 0, resetMs };
    }

    record.timestamps.push(now);
    return {
      success: true,
      remaining: this.maxRequests - record.timestamps.length,
      resetMs: this.windowMs,
    };
  }

  private cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    for (const [key, record] of this.store.entries()) {
      record.timestamps = record.timestamps.filter((ts) => ts > windowStart);
      if (record.timestamps.length === 0) {
        this.store.delete(key);
      }
    }
  }
}

export const orderLookupRateLimiter = new SlidingWindowRateLimiter(60_000, 30);
export const generalApiRateLimiter = new SlidingWindowRateLimiter(60_000, 120);
