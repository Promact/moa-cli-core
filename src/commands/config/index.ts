/**
 * Config Command
 * Manage CLI configuration and profiles
 * Usage: moa config <subcommand>
 */

import { Command, Flags } from '@oclif/core';

import { getAuthManager } from '../../lib/auth/auth-manager.js';
import { getConfigManager } from '../../lib/config/config-manager.js';

export default class Config extends Command {
    static override description = 'Display current configuration and profiles';
static override examples = [
        '<%= config.bin %> <%= command.id %>',
        '<%= config.bin %> <%= command.id %> --profile=client-a',
    ];
static override flags = {
        profile: Flags.string({
            char: 'p',
            description: 'Show configuration for specific profile',
        }),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(Config);
        const configManager = getConfigManager();
        const authManager = getAuthManager();

        const activeProfile = configManager.getActiveProfile();
        const profiles = configManager.listProfiles();
        const targetProfile = flags.profile || activeProfile;

        this.log('\n=== MOA CLI Configuration ===\n');
        this.log(`Config directory: ${configManager.getConfigDir()}`);
        this.log(`Active profile: ${activeProfile}`);
        this.log(`Available profiles: ${profiles.join(', ')}\n`);

        // Show providers for the target profile
        const providers = await authManager.listProviders(targetProfile);

        this.log(`--- Profile: ${targetProfile} ---`);
        if (providers.length === 0) {
            this.log('  No authenticated providers');
        } else {
            this.log('  Authenticated providers:');
            for (const provider of providers) {
                const hasCredentials = await authManager.hasCredentials(provider, targetProfile);
                const status = hasCredentials ? '✓' : '✗';
                this.log(`    ${status} ${provider}`);
            }
        }

        this.log('');
    }
}
