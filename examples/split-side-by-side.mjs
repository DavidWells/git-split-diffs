// Example: split side-by-side diffs
import { formatDiff } from '../build/api.mjs'

const sampleDiff = `diff --git a/handler.js b/handler.js
index 1234567..abcdefg 100644
--- a/handler.js
+++ b/handler.js
@@ -7,7 +7,7 @@ module.exports.handler = async event => {
       statusCode: 200,
       body: JSON.stringify(
         {
-          message: 'work v25',
+          message: 'work v26',
           input: event,
         },
         null,
@@ -21,3 +21,4 @@ module.exports.handler = async event => {
     // work v23 - test deploy summary + PR comment
     // work v24 - test with SMART_CI_MODE=clone
     // work v25 - verify diff output fix (PR #176)
+    // work v26 - test LINES env var for full-width backgrounds
`

// Default: split diffs require SCREEN_WIDTH >= MIN_LINE_WIDTH * 2
// With minLineWidth=80 (default), need 160+ columns for split view

console.log('='.repeat(60))
console.log('UNIFIED VIEW (minLineWidth=80, width=100)')
console.log('100 < 80*2=160, so unified/stacked view')
console.log('='.repeat(60))
const unified = await formatDiff(sampleDiff, {
  width: 100,
  minLineWidth: 80,
  disableDefaultBackground: true
})
console.log(unified)

console.log('\n')
console.log('='.repeat(60))
console.log('SPLIT VIEW (minLineWidth=40, width=100)')
console.log('100 >= 40*2=80, so side-by-side split view')
console.log('='.repeat(60))
const split = await formatDiff(sampleDiff, {
  width: 100,
  minLineWidth: 40,
  disableDefaultBackground: true
})
console.log(split)

console.log('\n')
console.log('='.repeat(60))
console.log('SPLIT VIEW (minLineWidth=80, width=160)')
console.log('160 >= 80*2=160, so side-by-side split view')
console.log('='.repeat(60))
const splitWide = await formatDiff(sampleDiff, {
  width: 160,
  minLineWidth: 80,
  disableDefaultBackground: true
})
console.log(splitWide)
