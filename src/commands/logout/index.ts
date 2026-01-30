/**
 * Logout Command
 * Remove stored credentials for a SaaS provider
 * Usage: moa logout <service> [--profile=<name>]
 */

import { confirm } from '@inquirer/prompts';
import { Args, Command, Flags } from '@oclif/core';

import { getAuthManager } from '../../lib/auth/auth-manager.js';

const SUPPORTED_PROVIDERS = ['hubspot', 'semrush', 'meta'] as const;
type SupportedProvider = typeof SUPPORTED_PROVIDERS[number];

export default class Logout extends Command {
    static override args = {
        service: Args.string({
            description: 'SaaS service to remove credentials for',
            options: [...SUPPORTED_PROVIDERS],
            required: true,
        }),
    };
static override description = 'Remove stored credentials for a SaaS provider';
static override examples = [
        '<%= config.bin %> <%= command.id %> hubspot',
        '<%= config.bin %> <%= command.id %> hubspot --profile=client-a',
    ];
static override flags = {
        force: Flags.boolean({
            char: 'f',
            default: false,
            description: 'Skip confirmation prompt',
        }),
        profile: Flags.string({
            char: 'p',
            default: 'default',
            description: 'Profile name to remove credentials from',
        }),
    };

    async run(): Promise<void> {
        const { args, flags } = await this.parse(Logout);
        const service = args.service as SupportedProvider;
        const {profile} = flags;

        const authManager = getAuthManager();
        const hasCredentials = await authManager.hasCredentials(service, profile);

        if (!hasCredentials) {
            this.log(`No credentials found for ${service} (profile: ${profile})`);
            return;
        }

        if (!flags.force) {
            const shouldDelete = await confirm({
                default: false,
                message: `Remove credentials for ${service} (profile: ${profile})?`,
            });
            if (!shouldDelete) {
                this.log('Logout cancelled.');
                return;
            }
        }

        await authManager.deleteCredentials(service, profile);
        this.log(`\n✓ Removed credentials for ${service} (profile: ${profile})\n`);
    }
}
