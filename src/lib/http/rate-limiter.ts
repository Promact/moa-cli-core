/**
 * Token Bucket Rate Limiter
 * Implements a configurable rate limiting strategy for API calls
 */

import Bottleneck from 'bottleneck';

export interface RateLimiterConfig {
  /** Maximum requests per interval */
  maxConcurrent?: number;
  /** Minimum time between requests in ms */
  minTime?: number;
  /** Reservoir size (max burst) */
  reservoir?: number;
  /** Amount to refresh reservoir by */
  reservoirRefreshAmount?: number;
  /** Reservoir refresh interval in ms */
  reservoirRefreshInterval?: number;
}

const DEFAULT_CONFIG: RateLimiterConfig = {
  maxConcurrent: 5,
  minTime: 100, // 10 req/sec
  reservoir: 10,
  reservoirRefreshAmount: 10,
  reservoirRefreshInterval: 1000,
};

/**
 * Provider-specific rate limit configurations
 */
export const PROVIDER_LIMITS: Record<string, RateLimiterConfig> = {
  hubspot: {
    maxConcurrent: 10,
    minTime: 100,
    reservoir: 100,
    reservoirRefreshAmount: 100,
    reservoirRefreshInterval: 10_000, // 100 req/10s
  },
  meta: {
    maxConcurrent: 5,
    minTime: 100,
    reservoir: 10,
    reservoirRefreshAmount: 10,
    reservoirRefreshInterval: 1000,
  },
  semrush: {
    maxConcurrent: 5,
    minTime: 200, // 5 req/sec
    reservoir: 5,
    reservoirRefreshAmount: 5,
    reservoirRefreshInterval: 1000,
  },
};

export class RateLimiter {
  private globalLimiter: Bottleneck;
  private limiters: Map<string, Bottleneck> = new Map();

  constructor(globalConfig: RateLimiterConfig = DEFAULT_CONFIG) {
    this.globalLimiter = new Bottleneck(globalConfig);
  }

  /**
   * Execute a function with rate limiting
   */
  async execute<T>(
    fn: () => Promise<T>,
    provider?: string
  ): Promise<T> {
    const limiter = this.getLimiter(provider);
    return limiter.schedule(fn);
  }

  /**
   * Get or create a limiter for a specific provider
   */
  getLimiter(provider?: string): Bottleneck {
    if (!provider) {
      return this.globalLimiter;
    }

    if (!this.limiters.has(provider)) {
      const config = PROVIDER_LIMITS[provider] || DEFAULT_CONFIG;
      const limiter = new Bottleneck(config);
      
      // Chain with global limiter
      limiter.chain(this.globalLimiter);
      this.limiters.set(provider, limiter);
    }

    return this.limiters.get(provider)!;
  }

  /**
   * Get current limiter stats
   */
  getStats(provider?: string): Bottleneck.Counts {
    const limiter = this.getLimiter(provider);
    return limiter.counts();
  }
}

// Singleton instance
let instance: null | RateLimiter = null;

export function getRateLimiter(): RateLimiter {
  if (!instance) {
    instance = new RateLimiter();
  }

  return instance;
}
