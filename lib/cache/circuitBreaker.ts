/**
 * Circuit Breaker pattern to isolate failure cascades during high traffic bursts.
 */

export enum CircuitState {
  CLOSED = "CLOSED", // Normal operations
  OPEN = "OPEN",     // Failing: fast fallback without calling downstream service
  HALF_OPEN = "HALF_OPEN", // Canary testing health of downstream
}

export interface CircuitBreakerOptions {
  failureThreshold?: number; // Failures before tripping (default: 5)
  recoveryTimeMs?: number;   // Cool-down period before attempting canary (default: 15s)
  timeoutMs?: number;        // Call timeout before considered failed (default: 3000ms)
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount: number = 0;
  private lastStateChangedAt: number = Date.now();
  private readonly failureThreshold: number;
  private readonly recoveryTimeMs: number;
  private readonly timeoutMs: number;

  constructor(private readonly name: string, options?: CircuitBreakerOptions) {
    this.failureThreshold = options?.failureThreshold ?? 5;
    this.recoveryTimeMs = options?.recoveryTimeMs ?? 15_000;
    this.timeoutMs = options?.timeoutMs ?? 3000;
  }

  getState(): CircuitState {
    if (
      this.state === CircuitState.OPEN &&
      Date.now() - this.lastStateChangedAt > this.recoveryTimeMs
    ) {
      this.state = CircuitState.HALF_OPEN;
      this.lastStateChangedAt = Date.now();
    }
    return this.state;
  }

  async execute<T>(fn: () => Promise<T>, fallback: () => T | Promise<T>): Promise<T> {
    const currentState = this.getState();

    if (currentState === CircuitState.OPEN) {
      return fallback();
    }

    try {
      // Execute with timeout
      const result = await Promise.race([
        fn(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`[CircuitBreaker:${this.name}] Timeout`)), this.timeoutMs)
        ),
      ]);

      this.onSuccess();
      return result;
    } catch {
      this.onFailure();
      return fallback();
    }
  }

  private onSuccess(): void {
    if (this.state === CircuitState.HALF_OPEN) {
      this.state = CircuitState.CLOSED;
      this.failureCount = 0;
      this.lastStateChangedAt = Date.now();
    }
  }

  private onFailure(): void {
    this.failureCount += 1;
    if (this.failureCount >= this.failureThreshold || this.state === CircuitState.HALF_OPEN) {
      this.state = CircuitState.OPEN;
      this.lastStateChangedAt = Date.now();
    }
  }
}

export const dbCircuitBreaker = new CircuitBreaker("SupabaseDB", {
  failureThreshold: 4,
  recoveryTimeMs: 10_000,
  timeoutMs: 2500,
});
