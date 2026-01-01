import * as path from 'path';
import type { WriteStream } from "node:tty";
import supportsHyperlinks from "supports-hyperlinks";

/**
 * Detect OSC-8 hyperlink support for a given stream (defaults to stdout).
 */
export function hyperlinkSupported(
	stream: WriteStream = process.stdout,
): boolean {
	const helper = supportsHyperlinks as unknown as {
		stdout?: boolean | ((s: WriteStream) => boolean);
		default?: (s: WriteStream) => boolean;
	};
	try {
		if (typeof supportsHyperlinks === "function") {
			return Boolean(
				(supportsHyperlinks as (s: WriteStream) => boolean)(stream),
			);
		}
		// supports-hyperlinks@4.x exports pre-evaluated booleans, not functions
		if (typeof helper.stdout === "boolean") return helper.stdout;
		if (typeof helper.stdout === "function") return Boolean(helper.stdout(stream));
		if (helper.default && typeof helper.default === "function")
			return Boolean(helper.default(stream));
	} catch {
		return false;
	}
	return false;
}

/**
 * Build an OSC-8 hyperlink sequence.
 */
export function osc8(url: string, text: string): string {
	return `\u001B]8;;${url}\u0007${text}\u001B]8;;\u0007`;
}

/**
 * Creates a simple file path hyperlink using file:// protocol
 */
export function createFileLink(
    filePath: string,
    gitRoot?: string
): string {
    // If we have a git root, resolve paths relative to it
    // Otherwise fall back to resolving from cwd
    const absolutePath = gitRoot
        ? path.resolve(gitRoot, filePath)
        : path.resolve(filePath);

    const url = `file://${absolutePath}`;

    // Return a special marker that will be replaced with ANSI escape sequences later
    return `__FILE_LINK__${url}__${filePath}__FILE_LINK_END__`;
}

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
 * The regex needs to handle ANSI color codes that might be inserted by chalk
 */
export function replaceEditorLinks(text: string): string {
    // Pattern that matches any character including ANSI escape codes
    // (?:\x1b\[[0-9;]*m)? optionally matches ANSI color codes
    const ansiPattern = '(?:[\\s\\S]|(?:\\x1b\\[[0-9;]*m))+?';

    // Replace file links - pattern handles ANSI codes between delimiters
    const fileLinkRegex = new RegExp(`__FILE_LINK__(${ansiPattern})__(${ansiPattern})__FILE_LINK_END__`, 'g');
    text = text.replace(fileLinkRegex, (match, url, display) => {
        // Strip ANSI codes from url and display to get clean values
        const cleanUrl = url.replace(/\x1b\[[0-9;]*m/g, '');
        const cleanDisplay = display.replace(/\x1b\[[0-9;]*m/g, '');
        return `\x1b]8;;${cleanUrl}\x1b\\${cleanDisplay}\x1b]8;;\x1b\\`;
    });

    // Replace editor links (for line numbers)
    const editorLinkRegex = new RegExp(`__EDITOR_LINK__(${ansiPattern})__(${ansiPattern})__EDITOR_LINK_END__`, 'g');
    text = text.replace(editorLinkRegex, (match, url, display) => {
        // Strip ANSI codes from url and display to get clean values
        const cleanUrl = url.replace(/\x1b\[[0-9;]*m/g, '');
        const cleanDisplay = display.replace(/\x1b\[[0-9;]*m/g, '');
        return `\x1b]8;;${cleanUrl}\x1b\\${cleanDisplay}\x1b]8;;\x1b\\`;
    });

    return text;
}
