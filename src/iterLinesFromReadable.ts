import * as stream from 'stream';

/**
 * Given a string, yields each part in the string terminated by a newline and
 * returns the final part without a newline.
 */
function* yieldLinesFromString(string: string) {
    // Strip out carraige returns. We can't simply look for \r\n because git can
    // sometimes emit ansi color codes between \r and \n.
    string = string.replace(/\r/g, '');

    // A fresh /g regex per call: its lastIndex is exec state, and this
    // generator yields mid-loop, so a shared one is corrupted by any other
    // diff formatting at the same time (concurrent formatDiff calls).
    const newlineRegex = /\n/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = newlineRegex.exec(string))) {
        yield string.slice(lastIndex, match.index);
        lastIndex = match.index + match[0].length;
    }
    return string.slice(lastIndex);
}

/**
 * Converts a readable stream to an iterator that yields the stream's contents
 * line-by-line.
 */
export async function* iterlinesFromReadable(
    readable: stream.Readable
): AsyncIterable<string> {
    let string: string = '';
    for await (const chunk of readable) {
        string += (chunk as Buffer).toString();
        string = yield* yieldLinesFromString(string);
    }
    yield string;
}
