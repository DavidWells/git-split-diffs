import chalk from 'chalk';
import * as path from 'path';

export function createEditorLink(filePath: string, line = 1, column = 1, customDisplay: string | null = null): string {
    const absolutePath = path.resolve(filePath);
    const url = `cursor://file${absolutePath}:${line}:${column}`;
    const display = customDisplay ? customDisplay : `${path.basename(filePath)}:${line}`;
    
    return `\x1b]8;;${url}\x1b\\${chalk.cyanBright(display)}\x1b]8;;\x1b\\`;
}