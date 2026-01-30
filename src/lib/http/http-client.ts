/**
 * HTTP Client with retry logic and rate limiting
 * Wraps axios with automatic retries and exponential backoff
 */

import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import { getRateLimiter } from './rate-limiter.js';

export interface HttpClientConfig {
    /** Base URL for all requests */
    baseURL?: string;
    /** Request timeout in ms */
    timeout?: number;
    /** Maximum retry attempts */
    maxRetries?: number;
    /** Provider name for rate limiting */
    provider?: string;
    /** Custom headers */
    headers?: Record<string, string>;
}

interface RetryConfig extends InternalAxiosRequestConfig {
    _retryCount?: number;
    _provider?: string;
}

const DEFAULT_CONFIG: HttpClientConfig = {
    timeout: 30000,
    maxRetries: 3,
};

/**
 * Calculate exponential backoff delay
 */
function getBackoffDelay(retryCount: number, baseDelay = 1000): number {
    return Math.min(baseDelay * Math.pow(2, retryCount), 30000);
}

/**
 * Check if error is retryable
 */
function isRetryableError(error: AxiosError): boolean {
    // Network errors
    if (!error.response) {
        return true;
    }

    // Rate limit errors
    if (error.response.status === 429) {
        return true;
    }

    // Server errors (5xx)
    if (error.response.status >= 500) {
        return true;
    }

    return false;
}

/**
 * Get Retry-After header value in ms
 */
function getRetryAfter(error: AxiosError): number | null {
    const retryAfter = error.response?.headers?.['retry-after'];
    if (!retryAfter) return null;

    const seconds = parseInt(retryAfter, 10);
    if (!isNaN(seconds)) {
        return seconds * 1000;
    }

    // Try parsing as date
    const date = new Date(retryAfter);
    if (!isNaN(date.getTime())) {
        return Math.max(0, date.getTime() - Date.now());
    }

    return null;
}

/**
 * Sleep for specified duration
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class HttpClient {
    private client: AxiosInstance;
    private config: HttpClientConfig;

    constructor(config: HttpClientConfig = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };

        this.client = axios.create({
            baseURL: this.config.baseURL,
            timeout: this.config.timeout,
            headers: this.config.headers,
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Request interceptor - add provider info
        this.client.interceptors.request.use((config: RetryConfig) => {
            config._provider = this.config.provider;
            config._retryCount = config._retryCount || 0;
            return config;
        });

        // Response interceptor - handle retries
        this.client.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error: AxiosError) => {
                const config = error.config as RetryConfig;

                if (!config || !isRetryableError(error)) {
                    return Promise.reject(error);
                }

                const retryCount = config._retryCount || 0;
                const maxRetries = this.config.maxRetries || DEFAULT_CONFIG.maxRetries!;

                if (retryCount >= maxRetries) {
                    return Promise.reject(error);
                }

                // Calculate delay
                let delay = getRetryAfter(error) || getBackoffDelay(retryCount);

                // Log retry attempt
                console.error(
                    `Request failed (attempt ${retryCount + 1}/${maxRetries}). ` +
                    `Retrying in ${delay}ms...`
                );

                // Wait before retry
                await sleep(delay);

                // Increment retry count
                config._retryCount = retryCount + 1;

                // Retry the request
                return this.client.request(config);
            }
        );
    }

    /**
     * Make a rate-limited GET request
     */
    async get<T = any>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        const rateLimiter = getRateLimiter();
        return rateLimiter.execute(
            () => this.client.get<T>(url, config),
            this.config.provider
        );
    }

    /**
     * Make a rate-limited POST request
     */
    async post<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        const rateLimiter = getRateLimiter();
        return rateLimiter.execute(
            () => this.client.post<T>(url, data, config),
            this.config.provider
        );
    }

    /**
     * Make a rate-limited PUT request
     */
    async put<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        const rateLimiter = getRateLimiter();
        return rateLimiter.execute(
            () => this.client.put<T>(url, data, config),
            this.config.provider
        );
    }

    /**
     * Make a rate-limited PATCH request
     */
    async patch<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        const rateLimiter = getRateLimiter();
        return rateLimiter.execute(
            () => this.client.patch<T>(url, data, config),
            this.config.provider
        );
    }

    /**
     * Make a rate-limited DELETE request
     */
    async delete<T = any>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        const rateLimiter = getRateLimiter();
        return rateLimiter.execute(
            () => this.client.delete<T>(url, config),
            this.config.provider
        );
    }

    /**
     * Set authorization header
     */
    setAuthHeader(token: string, type: 'Bearer' | 'Basic' = 'Bearer'): void {
        this.client.defaults.headers.common['Authorization'] = `${type} ${token}`;
    }

    /**
     * Clear authorization header
     */
    clearAuthHeader(): void {
        delete this.client.defaults.headers.common['Authorization'];
    }
}

/**
 * Create a new HTTP client for a provider
 */
export function createHttpClient(config: HttpClientConfig = {}): HttpClient {
    return new HttpClient(config);
}
