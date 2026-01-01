import { Context } from './context';
import { T, FormattedString } from './formattedString';
import { createFileLink } from './editorLinks';

export function* iterFormatFileName(
    context: Context,
    fileNameA: string,
    fileNameB: string
): Iterable<FormattedString> {
    const {
        HORIZONTAL_SEPARATOR,
        INSERTED_LINE_COLOR,
        DELETED_LINE_COLOR,
        INSERTED_LINE_NO_COLOR,
        DELETED_LINE_NO_COLOR,
        FILE_NAME_COLOR,
        SCREEN_WIDTH,
        HIDE_FILE_HEADER,
        HIDE_HEADER_TOP_LINE,
        HIDE_HEADER_BOTTOM_LINE,
    } = context;

    // If hiding file header, return early
    if (HIDE_FILE_HEADER) {
        return;
    }

    if (HIDE_HEADER_TOP_LINE) {
        yield T().fillWidth(SCREEN_WIDTH, ' ')
    } else {
        yield HORIZONTAL_SEPARATOR;
    }

    const formattedString = T().appendString(' ■■ ');

    // Calculate the display text (without link markers) to determine visual width
    // Only apply LINE_COLOR to indicators (for foreground) - backgrounds come from LINE_NO_COLOR
    const stripBg = (c: typeof DELETED_LINE_COLOR) => ({ ...c, backgroundColor: undefined })
    let displayText;
    if (!fileNameA) {
        formattedString
            .addSpan(1, 3, INSERTED_LINE_NO_COLOR)
            .addSpan(1, 3, stripBg(INSERTED_LINE_COLOR));
        displayText = fileNameB;
    } else if (!fileNameB) {
        formattedString
            .addSpan(1, 3, DELETED_LINE_NO_COLOR)
            .addSpan(1, 3, stripBg(DELETED_LINE_COLOR));
        displayText = fileNameA;
    } else if (fileNameA === fileNameB) {
        formattedString
            .addSpan(1, 2, DELETED_LINE_NO_COLOR)
            .addSpan(2, 3, INSERTED_LINE_NO_COLOR)
            .addSpan(1, 2, stripBg(DELETED_LINE_COLOR))
            .addSpan(2, 3, stripBg(INSERTED_LINE_COLOR));
        displayText = fileNameA;
    } else {
        formattedString
            .addSpan(1, 2, DELETED_LINE_NO_COLOR)
            .addSpan(2, 3, INSERTED_LINE_NO_COLOR)
            .addSpan(1, 2, stripBg(DELETED_LINE_COLOR))
            .addSpan(2, 3, stripBg(INSERTED_LINE_COLOR));
        displayText = `${fileNameA} -> ${fileNameB}`;
    }

    // Calculate visual width BEFORE adding link markers
    // ' ■■ ' = 4 chars
    const prefixWidth = 4;
    const availableWidth = SCREEN_WIDTH - prefixWidth;
    const displayWidth = displayText.length;

    // Truncate display text if needed
    const truncatedDisplay = displayWidth > availableWidth
        ? displayText.slice(0, availableWidth)
        : displayText;

    // Now create linked version of the (possibly truncated) text
    let fileNameLabel;
    const shouldHyperlink = context.HYPERLINK_FILE_NAMES !== false && context.HYPERLINK_SUPPORTED;

    if (!fileNameA) {
        fileNameLabel = shouldHyperlink
            ? createFileLink(fileNameB, context.GIT_ROOT)
            : fileNameB;
    } else if (!fileNameB) {
        fileNameLabel = shouldHyperlink
            ? createFileLink(fileNameA, context.GIT_ROOT)
            : fileNameA;
    } else if (fileNameA === fileNameB) {
        fileNameLabel = shouldHyperlink
            ? createFileLink(fileNameA, context.GIT_ROOT)
            : fileNameA;
    } else {
        if (shouldHyperlink) {
            const linkA = createFileLink(fileNameA, context.GIT_ROOT);
            const linkB = createFileLink(fileNameB, context.GIT_ROOT);
            fileNameLabel = `${linkA} -> ${linkB}`;
        } else {
            fileNameLabel = `${fileNameA} -> ${fileNameB}`;
        }
    }

    formattedString.appendString(fileNameLabel);

    // Add padding based on the truncated display width
    const paddingNeeded = availableWidth - truncatedDisplay.length;
    if (paddingNeeded > 0) {
        formattedString.appendString(' '.repeat(paddingNeeded));
    }

    // Add background color to the entire line
    const totalLength = formattedString.getString().length;
    formattedString.addSpan(0, totalLength, FILE_NAME_COLOR);
    yield formattedString;

    if (HIDE_HEADER_BOTTOM_LINE) {
        yield T().fillWidth(SCREEN_WIDTH, ' ')
    } else {
        yield HORIZONTAL_SEPARATOR;
    }
}
