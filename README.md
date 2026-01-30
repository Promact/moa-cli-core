@promactinfo/moa-cli
=================

Mother of All CLI for AI automation


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@promactinfo/moa-cli.svg)](https://npmjs.org/package/@promactinfo/moa-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@promactinfo/moa-cli.svg)](https://npmjs.org/package/@promactinfo/moa-cli)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @promactinfo/moa-cli
$ moa COMMAND
running command...
$ moa (--version)
@promactinfo/moa-cli/0.1.0 win32-x64 node-v22.21.1
$ moa --help [COMMAND]
USAGE
  $ moa COMMAND
...
```
<!-- usagestop -->

# Commands
<!-- commands -->
* [`moa config`](#moa-config)
* [`moa config use PROFILE`](#moa-config-use-profile)
* [`moa hello PERSON`](#moa-hello-person)
* [`moa hello world`](#moa-hello-world)
* [`moa help [COMMAND]`](#moa-help-command)
* [`moa login SERVICE`](#moa-login-service)
* [`moa logout SERVICE`](#moa-logout-service)
* [`moa plugins`](#moa-plugins)
* [`moa plugins add PLUGIN`](#moa-plugins-add-plugin)
* [`moa plugins:inspect PLUGIN...`](#moa-pluginsinspect-plugin)
* [`moa plugins install PLUGIN`](#moa-plugins-install-plugin)
* [`moa plugins link PATH`](#moa-plugins-link-path)
* [`moa plugins remove [PLUGIN]`](#moa-plugins-remove-plugin)
* [`moa plugins reset`](#moa-plugins-reset)
* [`moa plugins uninstall [PLUGIN]`](#moa-plugins-uninstall-plugin)
* [`moa plugins unlink [PLUGIN]`](#moa-plugins-unlink-plugin)
* [`moa plugins update`](#moa-plugins-update)

## `moa config`

Display current configuration and profiles

```
USAGE
  $ moa config [-p <value>]

FLAGS
  -p, --profile=<value>  Show configuration for specific profile

DESCRIPTION
  Display current configuration and profiles

EXAMPLES
  $ moa config

  $ moa config --profile=client-a
```

_See code: [src/commands/config/index.ts](https://github.com/Promact/moa-cli-core/blob/v0.1.0/src/commands/config/index.ts)_

## `moa config use PROFILE`

Switch to a different profile

```
USAGE
  $ moa config use PROFILE

ARGUMENTS
  PROFILE  Profile name to switch to

DESCRIPTION
  Switch to a different profile

EXAMPLES
  $ moa config use client-a

  $ moa config use default
```

_See code: [src/commands/config/use.ts](https://github.com/Promact/moa-cli-core/blob/v0.1.0/src/commands/config/use.ts)_

## `moa hello PERSON`

Say hello

```
USAGE
  $ moa hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ moa hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/Promact/moa-cli-core/blob/v0.1.0/src/commands/hello/index.ts)_

## `moa hello world`

Say hello world

```
USAGE
  $ moa hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ moa hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/Promact/moa-cli-core/blob/v0.1.0/src/commands/hello/world.ts)_

## `moa help [COMMAND]`

Display help for moa.

```
USAGE
  $ moa help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for moa.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.37/src/commands/help.ts)_

## `moa login SERVICE`

Authenticate with a SaaS provider

```
USAGE
  $ moa login SERVICE [-p <value>]

ARGUMENTS
  SERVICE  (hubspot|semrush|meta) SaaS service to authenticate with

FLAGS
  -p, --profile=<value>  [default: default] Profile name to store credentials under

DESCRIPTION
  Authenticate with a SaaS provider

EXAMPLES
  $ moa login hubspot

  $ moa login hubspot --profile=client-a

  $ moa login semrush --profile=agency
```

_See code: [src/commands/login/index.ts](https://github.com/Promact/moa-cli-core/blob/v0.1.0/src/commands/login/index.ts)_

## `moa logout SERVICE`

Remove stored credentials for a SaaS provider

```
USAGE
  $ moa logout SERVICE [-f] [-p <value>]

ARGUMENTS
  SERVICE  (hubspot|semrush|meta) SaaS service to remove credentials for

FLAGS
  -f, --force            Skip confirmation prompt
  -p, --profile=<value>  [default: default] Profile name to remove credentials from

DESCRIPTION
  Remove stored credentials for a SaaS provider

EXAMPLES
  $ moa logout hubspot

  $ moa logout hubspot --profile=client-a
```

_See code: [src/commands/logout/index.ts](https://github.com/Promact/moa-cli-core/blob/v0.1.0/src/commands/logout/index.ts)_

## `moa plugins`

List installed plugins.

```
USAGE
  $ moa plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ moa plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.55/src/commands/plugins/index.ts)_

## `moa plugins add PLUGIN`

Installs a plugin into moa.

```
USAGE
  $ moa plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into moa.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the MOA_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the MOA_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ moa plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ moa plugins add myplugin

  Install a plugin from a github url.

    $ moa plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ moa plugins add someuser/someplugin
```

## `moa plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ moa plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ moa plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.55/src/commands/plugins/inspect.ts)_

## `moa plugins install PLUGIN`

Installs a plugin into moa.

```
USAGE
  $ moa plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into moa.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the MOA_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the MOA_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ moa plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ moa plugins install myplugin

  Install a plugin from a github url.

    $ moa plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ moa plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.55/src/commands/plugins/install.ts)_

## `moa plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ moa plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ moa plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.55/src/commands/plugins/link.ts)_

## `moa plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ moa plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ moa plugins unlink
  $ moa plugins remove

EXAMPLES
  $ moa plugins remove myplugin
```

## `moa plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ moa plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.55/src/commands/plugins/reset.ts)_

## `moa plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ moa plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ moa plugins unlink
  $ moa plugins remove

EXAMPLES
  $ moa plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.55/src/commands/plugins/uninstall.ts)_

## `moa plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ moa plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ moa plugins unlink
  $ moa plugins remove

EXAMPLES
  $ moa plugins unlink myplugin
```

## `moa plugins update`

Update installed plugins.

```
USAGE
  $ moa plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.55/src/commands/plugins/update.ts)_
<!-- commandsstop -->
* [`moa hello PERSON`](#moa-hello-person)
* [`moa hello world`](#moa-hello-world)
* [`moa help [COMMAND]`](#moa-help-command)
* [`moa plugins`](#moa-plugins)
* [`moa plugins add PLUGIN`](#moa-plugins-add-plugin)
* [`moa plugins:inspect PLUGIN...`](#moa-pluginsinspect-plugin)
* [`moa plugins install PLUGIN`](#moa-plugins-install-plugin)
* [`moa plugins link PATH`](#moa-plugins-link-path)
* [`moa plugins remove [PLUGIN]`](#moa-plugins-remove-plugin)
* [`moa plugins reset`](#moa-plugins-reset)
* [`moa plugins uninstall [PLUGIN]`](#moa-plugins-uninstall-plugin)
* [`moa plugins unlink [PLUGIN]`](#moa-plugins-unlink-plugin)
* [`moa plugins update`](#moa-plugins-update)

## `moa hello PERSON`

Say hello

```
USAGE
  $ moa hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ moa hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/Promact/moa-cli-core/blob/v0.0.0/src/commands/hello/index.ts)_

## `moa hello world`

Say hello world

```
USAGE
  $ moa hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ moa hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/Promact/moa-cli-core/blob/v0.0.0/src/commands/hello/world.ts)_

## `moa help [COMMAND]`

Display help for moa.

```
USAGE
  $ moa help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for moa.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.37/src/commands/help.ts)_

## `moa plugins`

List installed plugins.

```
USAGE
  $ moa plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ moa plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.55/src/commands/plugins/index.ts)_

## `moa plugins add PLUGIN`

Installs a plugin into moa.

```
USAGE
  $ moa plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into moa.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the MOA_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the MOA_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ moa plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ moa plugins add myplugin

  Install a plugin from a github url.

    $ moa plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ moa plugins add someuser/someplugin
```

## `moa plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ moa plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ moa plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.55/src/commands/plugins/inspect.ts)_

## `moa plugins install PLUGIN`

Installs a plugin into moa.

```
USAGE
  $ moa plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into moa.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the MOA_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the MOA_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ moa plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ moa plugins install myplugin

  Install a plugin from a github url.

    $ moa plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ moa plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.55/src/commands/plugins/install.ts)_

## `moa plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ moa plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ moa plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.55/src/commands/plugins/link.ts)_

## `moa plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ moa plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ moa plugins unlink
  $ moa plugins remove

EXAMPLES
  $ moa plugins remove myplugin
```

## `moa plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ moa plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.55/src/commands/plugins/reset.ts)_

## `moa plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ moa plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ moa plugins unlink
  $ moa plugins remove

EXAMPLES
  $ moa plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.55/src/commands/plugins/uninstall.ts)_

## `moa plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ moa plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ moa plugins unlink
  $ moa plugins remove

EXAMPLES
  $ moa plugins unlink myplugin
```

## `moa plugins update`

Update installed plugins.

```
USAGE
  $ moa plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.55/src/commands/plugins/update.ts)_
<!-- commandsstop -->
