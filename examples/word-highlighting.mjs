// Example: Word-level change highlighting
import { formatDiff } from '../build/api.mjs'

const diff = `diff --git a/config.js b/config.js
index 1234567..abcdefg 100644
--- a/config.js
+++ b/config.js
@@ -1,5 +1,5 @@
 module.exports = {
-  apiUrl: 'https://api.example.com/v1',
-  timeout: 5000,
-  retries: 3
+  apiUrl: 'https://api.production.com/v2',
+  timeout: 10000,
+  retries: 5
 }
`

console.log('='.repeat(80))
console.log('WITH WORD HIGHLIGHTING (default: highlightLineChanges: true)')
console.log('='.repeat(80))
const withHighlight = await formatDiff(diff, {
  width: 80,
  highlightLineChanges: true
})
console.log(withHighlight)

console.log('\n')
console.log('='.repeat(80))
console.log('WITHOUT WORD HIGHLIGHTING (highlightLineChanges: false)')
console.log('='.repeat(80))
const noHighlight = await formatDiff(diff, {
  width: 80,
  highlightLineChanges: false
})
console.log(noHighlight)
