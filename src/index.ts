import chalk from 'chalk';
import { exec } from 'child_process';
import * as process from 'process';
import terminalSize from 'terminal-size';
import * as util from 'util';
import { getContextForConfig } from './context';
import { getGitConfig } from './getGitConfig';
import { transformContentsStreaming } from './transformContentsStreaming';
import { getConfig } from './getConfig';
const execAsync = util.promisify(exec);

async function main() {
    const { stdout: gitConfigString } = await execAsync('git config -l');
    const gitConfig = getGitConfig(gitConfigString);
    const config = getConfig(gitConfig);

    // Get git repository root
    let gitRoot: string | undefined;
    try {
        const { stdout } = await execAsync('git rev-parse --show-toplevel');
        gitRoot = stdout.trim();
    } catch {
        // Not in a git repository or git not available
        gitRoot = undefined;
    }

    const context = await getContextForConfig(
        config,
        chalk,
        terminalSize().columns,
        gitRoot
    );
    await transformContentsStreaming(context, process.stdin, process.stdout);
}

main();
