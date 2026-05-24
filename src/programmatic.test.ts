import { formatDiff } from './programmatic';

const DIFF = `diff --git a/example.js b/example.js
index 1111111..2222222 100644
--- a/example.js
+++ b/example.js
@@ -1,3 +1,3 @@
 export function example() {
-  return 'old'
+  return 'new'
 }
`;

test('formatDiff reuses shiki highlighter instances', async () => {
    const originalWarn = console.warn;
    const warnings: unknown[][] = [];
    console.warn = (...args: unknown[]) => {
        warnings.push(args);
    };

    try {
        for (let i = 0; i < 12; i++) {
            await formatDiff(DIFF, {
                width: 100,
                wrapLines: false,
                syntaxHighlightingTheme: 'dark-plus',
            });
        }
    } finally {
        console.warn = originalWarn;
    }

    expect(
        warnings.some(([message]) =>
            String(message).includes('Shiki is supposed to be used as a singleton')
        )
    ).toBe(false);
});
