import * as path from 'path';

export function createEditorLink(
    filePath: string,
    line = 1,
    column = 1,
    customDisplay: string | null = null,
    gitRoot?: string
): string {
    // If we have a git root, resolve paths relative to it
    // Otherwise fall back to resolving from cwd
    const absolutePath = gitRoot
        ? path.resolve(gitRoot, filePath)
        : path.resolve(filePath);

    const url = `cursor://file${absolutePath}:${line}:${column}`;
    const display = customDisplay
        ? customDisplay
        : `${path.basename(filePath)}:${line}`;

    // Return a special marker that will be replaced with ANSI escape sequences later
    return `__EDITOR_LINK__${url}__${display}__EDITOR_LINK_END__`;
}

/**
 * Replaces editor link markers with actual ANSI escape sequences
 */
export function replaceEditorLinks(text: string): string {
    const linkRegex = /__EDITOR_LINK__(.+?)__(.+?)__EDITOR_LINK_END__/g;
    return text.replace(linkRegex, (match, url, display) => {
        return `\x1b]8;;${url}\x1b\\${display}\x1b]8;;\x1b\\`;
    });
}
