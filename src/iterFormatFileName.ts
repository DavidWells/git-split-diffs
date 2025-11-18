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
    } = context;

    yield HORIZONTAL_SEPARATOR;

    const formattedString = T().appendString(' ■■ ');

    // Calculate the display text (without link markers) to determine visual width
    let displayText;
    if (!fileNameA) {
        formattedString
            .addSpan(1, 3, INSERTED_LINE_NO_COLOR)
            .addSpan(1, 3, INSERTED_LINE_COLOR);
        displayText = fileNameB;
    } else if (!fileNameB) {
        formattedString
            .addSpan(1, 3, DELETED_LINE_NO_COLOR)
            .addSpan(1, 3, DELETED_LINE_COLOR);
        displayText = fileNameA;
    } else if (fileNameA === fileNameB) {
        formattedString
            .addSpan(1, 2, DELETED_LINE_NO_COLOR)
            .addSpan(2, 3, INSERTED_LINE_NO_COLOR)
            .addSpan(1, 2, DELETED_LINE_COLOR)
            .addSpan(2, 3, INSERTED_LINE_COLOR);
        displayText = fileNameA;
    } else {
        formattedString
            .addSpan(1, 2, DELETED_LINE_NO_COLOR)
            .addSpan(2, 3, INSERTED_LINE_NO_COLOR)
            .addSpan(1, 2, DELETED_LINE_COLOR)
            .addSpan(2, 3, INSERTED_LINE_COLOR);
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
    if (!fileNameA) {
        fileNameLabel = createFileLink(fileNameB, context.GIT_ROOT);
    } else if (!fileNameB) {
        fileNameLabel = createFileLink(fileNameA, context.GIT_ROOT);
    } else if (fileNameA === fileNameB) {
        fileNameLabel = createFileLink(fileNameA, context.GIT_ROOT);
    } else {
        const linkA = createFileLink(fileNameA, context.GIT_ROOT);
        const linkB = createFileLink(fileNameB, context.GIT_ROOT);
        fileNameLabel = `${linkA} -> ${linkB}`;
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

    yield HORIZONTAL_SEPARATOR;
}
