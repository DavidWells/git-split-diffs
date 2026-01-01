// Example: Minimal output - hide file header and hunk headers
import { formatDiff } from '../build/api.mjs'

const diff = `diff --git a/handler.js b/handler.js
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
`

console.log('='.repeat(80))
console.log('DEFAULT (with headers)')
console.log('='.repeat(80))
const withHeaders = await formatDiff(diff, { width: 80 })
console.log(withHeaders)

console.log('\n')
console.log('='.repeat(80))
console.log('HIDE FILE HEADER (hideFileHeader: true)')
console.log('='.repeat(80))
const noFileHeader = await formatDiff(diff, {
  width: 80,
  hideFileHeader: true
})
console.log(noFileHeader)

console.log('\n')
console.log('='.repeat(80))
console.log('OMIT HUNK HEADERS (omitHunkHeaders: true)')
console.log('='.repeat(80))
const noHunkHeaders = await formatDiff(diff, {
  width: 80,
  omitHunkHeaders: true
})
console.log(noHunkHeaders)

console.log('\n')
console.log('='.repeat(80))
console.log('MINIMAL - BOTH HIDDEN')
console.log('='.repeat(80))
const minimal = await formatDiff(diff, {
  width: 80,
  hideFileHeader: true,
  omitHunkHeaders: true
})
console.log(minimal)
