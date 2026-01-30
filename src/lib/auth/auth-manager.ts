/**
 * Auth Manager
 * Secure credential storage using OS Keychain via keytar
 * Falls back to file-based storage if keytar is unavailable
 * 
 * Note: keytar is loaded dynamically to avoid issues with native module
 * loading during oclif manifest generation.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { getConfigManager } from '../config/config-manager.js';

const SERVICE_NAME = 'moa-cli';

// Lazy-loaded keytar module
let keytarModule: typeof import('keytar') | null = null;
let keytarAvailable: boolean | null = null;

async function getKeytar(): Promise<typeof import('keytar') | null> {
    if (keytarAvailable === false) {
        return null;
    }

    if (!keytarModule) {
        try {
            keytarModule = await import('keytar');
            keytarAvailable = true;
        } catch {
            keytarAvailable = false;
            return null;
        }
    }
    return keytarModule;
}

/**
 * Fallback file-based storage
 * WARNING: This stores credentials in plain text and should only be used
 * when keytar is unavailable (e.g., during development on systems without
 * the required native build tools)
 */
class FileCredentialStore {
    private filePath: string;
    private credentials: Map<string, string> = new Map();

    constructor() {
        const configDir = getConfigManager().getConfigDir();
        this.filePath = path.join(configDir, '.credentials');
        this.load();
    }

    private load(): void {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, 'utf-8');
                const parsed = JSON.parse(data);
                this.credentials = new Map(Object.entries(parsed));
            }
        } catch {
            this.credentials = new Map();
        }
    }

    private save(): void {
        const dir = path.dirname(this.filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const data = Object.fromEntries(this.credentials);
        fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    }

    setPassword(service: string, account: string, password: string): void {
        this.credentials.set(`${service}:${account}`, password);
        this.save();
    }

    getPassword(service: string, account: string): string | null {
        return this.credentials.get(`${service}:${account}`) || null;
    }

    deletePassword(service: string, account: string): boolean {
        const key = `${service}:${account}`;
        if (this.credentials.has(key)) {
            this.credentials.delete(key);
            this.save();
            return true;
        }
        return false;
    }

    findCredentials(service: string): Array<{ account: string; password: string }> {
        const results: Array<{ account: string; password: string }> = [];
        const prefix = `${service}:`;
        for (const [key, password] of this.credentials) {
            if (key.startsWith(prefix)) {
                results.push({
                    account: key.slice(prefix.length),
                    password,
                });
            }
        }
        return results;
    }
}

let fallbackStore: FileCredentialStore | null = null;

function getFallbackStore(): FileCredentialStore {
    if (!fallbackStore) {
        fallbackStore = new FileCredentialStore();
    }
    return fallbackStore;
}

export interface Credentials {
    /** API key or access token */
    token: string;
    /** Token type (api_key, oauth, bearer) */
    tokenType: 'api_key' | 'oauth' | 'bearer';
    /** Refresh token for OAuth flows */
    refreshToken?: string;
    /** Token expiration timestamp */
    expiresAt?: number;
}

export class AuthManager {
    private warnedFallback = false;

    /**
     * Build the keychain account name for a provider/profile combo
     */
    private getAccountName(provider: string, profile?: string): string {
        const profileName = profile || getConfigManager().getActiveProfile();
        return `${provider}:${profileName}`;
    }

    private warnFallback(): void {
        if (!this.warnedFallback) {
            console.warn(
                '⚠️  Keytar not available. Using fallback file storage.\n' +
                '   For secure credential storage, install keytar dependencies:\n' +
                '   https://github.com/atom/node-keytar#on-windows'
            );
            this.warnedFallback = true;
        }
    }

    /**
     * Store credentials securely
     */
    async setCredentials(
        provider: string,
        credentials: Credentials,
        profile?: string
    ): Promise<void> {
        const keytar = await getKeytar();
        const account = this.getAccountName(provider, profile);
        const data = JSON.stringify(credentials);

        if (keytar) {
            await keytar.setPassword(SERVICE_NAME, account, data);
        } else {
            this.warnFallback();
            getFallbackStore().setPassword(SERVICE_NAME, account, data);
        }
    }

    /**
     * Retrieve stored credentials
     */
    async getCredentials(
        provider: string,
        profile?: string
    ): Promise<Credentials | null> {
        const keytar = await getKeytar();
        const account = this.getAccountName(provider, profile);

        let data: string | null;
        if (keytar) {
            data = await keytar.getPassword(SERVICE_NAME, account);
        } else {
            data = getFallbackStore().getPassword(SERVICE_NAME, account);
        }

        if (!data) {
            return null;
        }

        try {
            return JSON.parse(data) as Credentials;
        } catch {
            return null;
        }
    }

    /**
     * Delete stored credentials
     */
    async deleteCredentials(provider: string, profile?: string): Promise<boolean> {
        const keytar = await getKeytar();
        const account = this.getAccountName(provider, profile);

        if (keytar) {
            return keytar.deletePassword(SERVICE_NAME, account);
        } else {
            return getFallbackStore().deletePassword(SERVICE_NAME, account);
        }
    }

    /**
     * Check if credentials exist for a provider
     */
    async hasCredentials(provider: string, profile?: string): Promise<boolean> {
        const credentials = await this.getCredentials(provider, profile);
        return credentials !== null;
    }

    /**
     * Check if credentials are expired (for OAuth tokens)
     */
    async isTokenExpired(provider: string, profile?: string): Promise<boolean> {
        const credentials = await this.getCredentials(provider, profile);

        if (!credentials || !credentials.expiresAt) {
            return false; // No expiration set
        }

        // Add 60 second buffer
        return Date.now() >= credentials.expiresAt - 60000;
    }

    /**
     * Get the access token if valid
     */
    async getToken(provider: string, profile?: string): Promise<string | null> {
        const credentials = await this.getCredentials(provider, profile);

        if (!credentials) {
            return null;
        }

        if (await this.isTokenExpired(provider, profile)) {
            return null; // Token expired, needs refresh
        }

        return credentials.token;
    }

    /**
     * List all stored providers for a profile
     */
    async listProviders(profile?: string): Promise<string[]> {
        const keytar = await getKeytar();
        const profileName = profile || getConfigManager().getActiveProfile();

        let credentials: Array<{ account: string; password: string }>;
        if (keytar) {
            credentials = await keytar.findCredentials(SERVICE_NAME);
        } else {
            credentials = getFallbackStore().findCredentials(SERVICE_NAME);
        }

        return credentials
            .filter(cred => cred.account.endsWith(`:${profileName}`))
            .map(cred => cred.account.split(':')[0]);
    }

    /**
     * Clear all credentials for a profile
     */
    async clearProfile(profile?: string): Promise<void> {
        const providers = await this.listProviders(profile);
        for (const provider of providers) {
            await this.deleteCredentials(provider, profile);
        }
    }

    /**
     * Check if keytar is available
     */
    async isSecureStorageAvailable(): Promise<boolean> {
        const keytar = await getKeytar();
        return keytar !== null;
    }
}

// Singleton instance
let instance: AuthManager | null = null;

export function getAuthManager(): AuthManager {
    if (!instance) {
        instance = new AuthManager();
    }
    return instance;
}
