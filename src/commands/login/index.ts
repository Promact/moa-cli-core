/**
 * Login Command
 * Authenticate with SaaS providers
 * Usage: moa login <service> [--profile=<name>]
 */

import { Args, Command, Flags } from '@oclif/core';
import { confirm, password } from '@inquirer/prompts';
import { getAuthManager, Credentials } from '../../lib/auth/auth-manager.js';
import { getConfigManager } from '../../lib/config/config-manager.js';

const SUPPORTED_PROVIDERS = ['hubspot', 'semrush', 'meta'] as const;
type SupportedProvider = typeof SUPPORTED_PROVIDERS[number];

export default class Login extends Command {
    static override args = {
        service: Args.string({
            description: 'SaaS service to authenticate with',
            options: [...SUPPORTED_PROVIDERS],
            required: true,
        }),
    };

    static override description = 'Authenticate with a SaaS provider';

    static override examples = [
        '<%= config.bin %> <%= command.id %> hubspot',
        '<%= config.bin %> <%= command.id %> hubspot --profile=client-a',
        '<%= config.bin %> <%= command.id %> semrush --profile=agency',
    ];

    static override flags = {
        profile: Flags.string({
            char: 'p',
            description: 'Profile name to store credentials under',
            default: 'default',
        }),
    };

    async run(): Promise<void> {
        const { args, flags } = await this.parse(Login);
        const service = args.service as SupportedProvider;
        const profile = flags.profile;

        // Set active profile
        const configManager = getConfigManager();
        configManager.setActiveProfile(profile);

        this.log(`\nAuthenticating with ${service}...`);
        this.log(`Profile: ${profile}\n`);

        // Check for existing credentials
        const authManager = getAuthManager();
        const existing = await authManager.hasCredentials(service, profile);

        if (existing) {
            const overwrite = await confirm({
                message: 'Credentials already exist for this service/profile. Overwrite?',
                default: false,
            });
            if (!overwrite) {
                this.log('Login cancelled.');
                return;
            }
        }

        // Get authentication based on provider type
        const credentials = await this.promptForCredentials(service);

        // Store credentials securely
        await authManager.setCredentials(service, credentials, profile);

        this.log(`\n✓ Successfully authenticated with ${service}`);
        this.log(`  Profile: ${profile}`);
        this.log(`  Credentials stored securely in system keychain.\n`);
    }

    private async promptForCredentials(
        service: SupportedProvider
    ): Promise<Credentials> {
        switch (service) {
            case 'hubspot':
                return this.promptHubSpotCredentials();
            case 'semrush':
                return this.promptSemrushCredentials();
            case 'meta':
                return this.promptMetaCredentials();
            default:
                throw new Error(`Unsupported provider: ${service}`);
        }
    }

    private async promptHubSpotCredentials(): Promise<Credentials> {
        this.log('HubSpot uses Private App tokens for authentication.');
        this.log('Create one at: https://developers.hubspot.com/docs/api/private-apps\n');

        const token = await password({
            message: 'Enter your HubSpot Private App token:',
            mask: '*',
        });

        return {
            token,
            tokenType: 'bearer',
        };
    }

    private async promptSemrushCredentials(): Promise<Credentials> {
        this.log('Semrush uses API keys for authentication.');
        this.log('Find your API key at: https://www.semrush.com/accounts/profile/\n');

        const token = await password({
            message: 'Enter your Semrush API key:',
            mask: '*',
        });

        return {
            token,
            tokenType: 'api_key',
        };
    }

    private async promptMetaCredentials(): Promise<Credentials> {
        this.log('Meta Ads uses OAuth2 access tokens.');
        this.log('Generate a token at: https://developers.facebook.com/tools/explorer/\n');

        const token = await password({
            message: 'Enter your Meta access token:',
            mask: '*',
        });

        return {
            token,
            tokenType: 'oauth',
        };
    }
}
