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
  /** Reservoir refresh interval in ms */
  reservoirRefreshInterval?: number;
  /** Amount to refresh reservoir by */
  reservoirRefreshAmount?: number;
}

const DEFAULT_CONFIG: RateLimiterConfig = {
  maxConcurrent: 5,
  minTime: 100, // 10 req/sec
  reservoir: 10,
  reservoirRefreshInterval: 1000,
  reservoirRefreshAmount: 10,
};

/**
 * Provider-specific rate limit configurations
 */
export const PROVIDER_LIMITS: Record<string, RateLimiterConfig> = {
  hubspot: {
    maxConcurrent: 10,
    minTime: 100,
    reservoir: 100,
    reservoirRefreshInterval: 10000, // 100 req/10s
    reservoirRefreshAmount: 100,
  },
  semrush: {
    maxConcurrent: 5,
    minTime: 200, // 5 req/sec
    reservoir: 5,
    reservoirRefreshInterval: 1000,
    reservoirRefreshAmount: 5,
  },
  meta: {
    maxConcurrent: 5,
    minTime: 100,
    reservoir: 10,
    reservoirRefreshInterval: 1000,
    reservoirRefreshAmount: 10,
  },
};

export class RateLimiter {
  private limiters: Map<string, Bottleneck> = new Map();
  private globalLimiter: Bottleneck;

  constructor(globalConfig: RateLimiterConfig = DEFAULT_CONFIG) {
    this.globalLimiter = new Bottleneck(globalConfig);
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
   * Get current limiter stats
   */
  getStats(provider?: string): Bottleneck.Counts {
    const limiter = this.getLimiter(provider);
    return limiter.counts();
  }
}

// Singleton instance
let instance: RateLimiter | null = null;

export function getRateLimiter(): RateLimiter {
  if (!instance) {
    instance = new RateLimiter();
  }
  return instance;
}
