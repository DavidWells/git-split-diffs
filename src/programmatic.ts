// Programmatic API for git-split-diffs
import chalk from 'chalk';
import terminalSize from 'terminal-size';
import { Readable, Writable } from 'stream';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { getContextForConfig } from './context';
import { getConfig } from './getConfig';
import { transformContentsStreaming } from './transformContentsStreaming';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const THEMES_DIR = path.resolve(__dirname, '../themes');

export interface FormatDiffOptions {
  /**
   * Terminal width for formatting. Defaults to current terminal size.
   */
  width?: number;

  /**
   * Minimum line width. Defaults to 80.
   */
  minLineWidth?: number;

  /**
   * Whether to wrap long lines. Defaults to true.
   */
  wrapLines?: boolean;

  /**
   * Whether to highlight line changes. Defaults to true.
   */
  highlightLineChanges?: boolean;

  /**
   * Theme name to use. Defaults to 'dark'.
   */
  themeName?: string;

  /**
   * Syntax highlighting theme. Optional.
   */
  syntaxHighlightingTheme?: string;

  /**
   * Git repository root directory. Used to resolve file paths for editor links.
   */
  gitRootDir?: string;

  /**
   * Whether to add hyperlinks to file names. Defaults to true.
   */
  hyperlinkFileNames?: boolean;

  /**
   * Whether to add hyperlinks to line numbers. Defaults to true.
   */
  hyperlinkLineNumbers?: boolean;

  /**
   * Whether to hide the file header (separator lines and filename). Defaults to false.
   */
  hideFileHeader?: boolean;

  /**
   * Whether to omit hunk headers (the @@ lines). Defaults to false.
   */
  omitHunkHeaders?: boolean;
}

/**
 * Format a git diff string with split diffs styling
 *
 * @param diffContent - The raw git diff output
 * @param options - Formatting options
 * @returns Promise resolving to formatted diff string
 */
export async function formatDiff(
  diffContent: string,
  options: FormatDiffOptions = {}
): Promise<string> {
  const {
    width = terminalSize().columns,
    minLineWidth = 80,
    wrapLines = true,
    highlightLineChanges = true,
    themeName = 'dark',
    syntaxHighlightingTheme,
    gitRootDir,
    hyperlinkFileNames = true,
    hyperlinkLineNumbers = true,
    hideFileHeader = false,
    omitHunkHeaders = false,
  } = options;

  // Create config with options
  const config = getConfig({
    THEME_NAME: themeName,
    THEME_DIRECTORY: THEMES_DIR,
    MIN_LINE_WIDTH: minLineWidth,
    WRAP_LINES: wrapLines,
    HIGHLIGHT_LINE_CHANGES: highlightLineChanges,
    SYNTAX_HIGHLIGHTING_THEME: syntaxHighlightingTheme,
    HYPERLINK_FILE_NAMES: hyperlinkFileNames,
    HYPERLINK_LINE_NUMBERS: hyperlinkLineNumbers,
    HIDE_FILE_HEADER: hideFileHeader,
    OMIT_HUNK_HEADERS: omitHunkHeaders,
  });

  // Create context
  const context = await getContextForConfig(config, chalk, width, gitRootDir);

  // Create readable stream from diff content
  const inputStream = Readable.from([diffContent]);

  // Capture output to string
  let output = '';
  const outputStream = new Writable({
    write(chunk, encoding, callback) {
      output += chunk.toString();
      callback();
    },
  });

  // Transform the diff
  await transformContentsStreaming(context, inputStream, outputStream);

  return output;
}

/**
 * Format a git diff with default options
 *
 * @param diffContent - The raw git diff output
 * @returns Promise resolving to formatted diff string
 */
export async function formatDiffSimple(diffContent: string): Promise<string> {
  return formatDiff(diffContent);
}
