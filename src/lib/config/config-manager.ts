/**
 * Configuration Manager
 * Handles profile-based configuration storage
 */

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

export interface ProfileConfig {
    /** Default provider for this profile */
    defaultProvider?: string;
    /** Provider-specific settings */
    providers?: Record<string, Record<string, any>>;
}

export interface AppConfig {
    /** Current active profile */
    activeProfile: string;
    /** All profiles */
    profiles: Record<string, ProfileConfig>;
}

const DEFAULT_CONFIG: AppConfig = {
    activeProfile: 'default',
    profiles: {
        default: {},
    },
};

export class ConfigManager {
    private config: AppConfig;
    private configPath: string;

    constructor(configDir?: string) {
        const dir = configDir || path.join(os.homedir(), '.moa');
        this.configPath = path.join(dir, 'config.json');
        this.config = this.loadConfig();
    }

    /**
     * Delete a profile
     */
    deleteProfile(profileName: string): boolean {
        if (profileName === 'default') {
            throw new Error('Cannot delete the default profile');
        }

        if (this.config.profiles[profileName]) {
            delete this.config.profiles[profileName];
            if (this.config.activeProfile === profileName) {
                this.config.activeProfile = 'default';
            }

            this.saveConfig();
            return true;
        }

        return false;
    }

    /**
     * Get the active profile name
     */
    getActiveProfile(): string {
        return this.config.activeProfile;
    }

    /**
     * Get config directory path
     */
    getConfigDir(): string {
        return path.dirname(this.configPath);
    }

    /**
     * Get profile configuration
     */
    getProfile(profileName?: string): ProfileConfig {
        const name = profileName || this.config.activeProfile;
        return this.config.profiles[name] || {};
    }

    /**
     * Get provider-specific config for a profile
     */
    getProviderConfig(provider: string, profileName?: string): Record<string, any> {
        const profile = this.getProfile(profileName);
        return profile.providers?.[provider] || {};
    }

    /**
     * List all profiles
     */
    listProfiles(): string[] {
        return Object.keys(this.config.profiles);
    }

    /**
     * Set the active profile
     */
    setActiveProfile(profileName: string): void {
        if (!this.config.profiles[profileName]) {
            this.config.profiles[profileName] = {};
        }

        this.config.activeProfile = profileName;
        this.saveConfig();
    }

    /**
     * Set provider-specific config for a profile
     */
    setProviderConfig(
        provider: string,
        config: Record<string, any>,
        profileName?: string
    ): void {
        const name = profileName || this.config.activeProfile;
        if (!this.config.profiles[name]) {
            this.config.profiles[name] = {};
        }

        if (!this.config.profiles[name].providers) {
            this.config.profiles[name].providers = {};
        }

        this.config.profiles[name].providers![provider] = config;
        this.saveConfig();
    }

    /**
     * Update profile configuration
     */
    updateProfile(profileName: string, config: Partial<ProfileConfig>): void {
        if (!this.config.profiles[profileName]) {
            this.config.profiles[profileName] = {};
        }

        this.config.profiles[profileName] = {
            ...this.config.profiles[profileName],
            ...config,
        };
        this.saveConfig();
    }

    /**
     * Load config from disk
     */
    private loadConfig(): AppConfig {
        try {
            if (fs.existsSync(this.configPath)) {
                const data = fs.readFileSync(this.configPath, 'utf8');
                return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
            }
        } catch (error) {
            console.error('Error loading config:', error);
        }

        return { ...DEFAULT_CONFIG };
    }

    /**
     * Save config to disk
     */
    private saveConfig(): void {
        const dir = path.dirname(this.configPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(
            this.configPath,
            JSON.stringify(this.config, null, 2),
            'utf-8'
        );
    }
}

// Singleton instance
let instance: ConfigManager | null = null;

export function getConfigManager(): ConfigManager {
    if (!instance) {
        instance = new ConfigManager();
    }

    return instance;
}
