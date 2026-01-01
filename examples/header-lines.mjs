// Example: Hide header separator lines
import { formatDiff } from '../build/api.mjs'

const diff = `diff --git a/handler.js b/handler.js
index 1234567..abcdefg 100644
--- a/handler.js
+++ b/handler.js
@@ -1,3 +1,3 @@
 const x = 1
-const y = 2
+const y = 3
 const z = 4
`

console.log('='.repeat(80))
console.log('DEFAULT (both lines shown)')
console.log('='.repeat(80))
const both = await formatDiff(diff, { width: 80 })
console.log(both)

console.log('\n')
console.log('='.repeat(80))
console.log('HIDE TOP LINE (hideHeaderTopLine: true)')
console.log('='.repeat(80))
const noTop = await formatDiff(diff, {
  width: 80,
  hideHeaderTopLine: true
})
console.log(noTop)

console.log('\n')
console.log('='.repeat(80))
console.log('HIDE BOTTOM LINE (hideHeaderBottomLine: true)')
console.log('='.repeat(80))
const noBottom = await formatDiff(diff, {
  width: 80,
  hideHeaderBottomLine: true
})
console.log(noBottom)

console.log('\n')
console.log('='.repeat(80))
console.log('HIDE BOTH LINES')
console.log('='.repeat(80))
const noBoth = await formatDiff(diff, {
  width: 80,
  hideHeaderTopLine: true,
  hideHeaderBottomLine: true
})
console.log(noBoth)
