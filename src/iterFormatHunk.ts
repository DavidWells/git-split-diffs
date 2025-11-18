import { Context } from './context';
import { T, FormattedString } from './formattedString';
import { getChangesInLines } from './highlightChangesInLine';
import { iterFitTextToWidth } from './iterFitTextToWidth';
import { iterFormatHunkSplit } from './iterFormatHunkSplit';
import {
    iterFormatCombinedDiffHunkUnified,
    iterFormatUnifiedDiffHunkUnified,
} from './iterFormatHunkUnified';

export type HunkPart = {
    fileName: string;
    startLineNo: number;
    lines: (string | null)[];
};

export async function* iterFormatHunk(
    context: Context,
    diffType: 'unified-diff' | 'combined-diff',
    hunkHeaderLine: string,
    hunkParts: HunkPart[],
    hunkIndex: number = 0
): AsyncIterable<FormattedString> {
    const { HUNK_HEADER_COLOR, SCREEN_WIDTH, MIN_LINE_WIDTH, OMIT_HUNK_HEADERS } = context;

    // Handle hunk headers based on omit setting
    if (!OMIT_HUNK_HEADERS) {
        // Show full hunk header normally
        yield* iterFitTextToWidth(
            context,
            T().appendString(hunkHeaderLine),
            SCREEN_WIDTH,
            HUNK_HEADER_COLOR
        );
    } else if (hunkIndex > 0) {
        // When omitting, show "..." for subsequent hunks (not the first)
        yield* iterFitTextToWidth(
            context,
            T().appendString('   ...'),
            SCREEN_WIDTH,
            HUNK_HEADER_COLOR
        );
    }
    // First hunk (hunkIndex === 0) with OMIT_HUNK_HEADERS: output nothing

    // TODO: Fix to handle multiple hunk parts
    const changes = getChangesInLines(
        context,
        hunkParts[0].lines,
        hunkParts[1].lines
    );

    // Only split diffs if there's enough room
    const splitDiffs = SCREEN_WIDTH >= MIN_LINE_WIDTH * hunkParts.length;

    // Collect all hunk lines
    let hunkLines: FormattedString[] = [];
    if (splitDiffs) {
        for await (const line of iterFormatHunkSplit(context, hunkParts, changes)) {
            hunkLines.push(line);
        }
    } else if (diffType === 'unified-diff') {
        for await (const line of iterFormatUnifiedDiffHunkUnified(context, hunkParts, changes)) {
            hunkLines.push(line);
        }
    } else if (diffType === 'combined-diff') {
        for await (const line of iterFormatCombinedDiffHunkUnified(context, hunkParts, changes)) {
            hunkLines.push(line);
        }
    }

    // Trim last empty lines if enabled
    if (context.TRIM_LAST_EMPTY_LINE) {
        while (hunkLines.length > 0) {
            const lastLine = hunkLines[hunkLines.length - 1];
            let lineText = lastLine.getString();

            // Strip ANSI escape codes (colors)
            lineText = lineText.replace(/\x1b\[[0-9;]*m/g, '');
            // Strip hyperlink markers
            lineText = lineText.replace(/__(?:EDITOR|FILE)_LINK__[^]*?__(?:EDITOR|FILE)_LINK_END__/g, '');
            // Strip OSC 8 hyperlinks
            lineText = lineText.replace(/\x1b\]8;;[^\x1b]*\x1b\\/g, '');

            // Now check if what's left is just whitespace and/or digits (line numbers)
            const contentOnly = lineText.replace(/[\s\d]/g, '');

            if (contentOnly.length === 0) {
                hunkLines.pop();
            } else {
                break;
            }
        }
    }

    // Yield the (possibly trimmed) lines
    for (const line of hunkLines) {
        yield line;
    }
}
