/**
 * Config Use Command
 * Switch active profile
 * Usage: moa config use <profile>
 */

import { Args, Command } from '@oclif/core';
import { getConfigManager } from '../../lib/config/config-manager.js';

export default class ConfigUse extends Command {
    static override args = {
        profile: Args.string({
            description: 'Profile name to switch to',
            required: true,
        }),
    };

    static override description = 'Switch to a different profile';

    static override examples = [
        '<%= config.bin %> <%= command.id %> client-a',
        '<%= config.bin %> <%= command.id %> default',
    ];

    async run(): Promise<void> {
        const { args } = await this.parse(ConfigUse);
        const configManager = getConfigManager();

        const previousProfile = configManager.getActiveProfile();
        configManager.setActiveProfile(args.profile);

        this.log(`\n✓ Switched from "${previousProfile}" to "${args.profile}"\n`);
    }
}
