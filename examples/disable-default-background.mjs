// Example: disableDefaultBackground option for CI environments
import { formatDiff } from '../build/api.mjs'

import { makeBox, getInnerWidth } from '@davidwells/box-logger'

// Box config for the diff container
const boxConfig = {
  paddingLeft: 1,
  paddingRight: 0,
  borderStyle: 'rounded',
  borderColor: '#4287f5'
}

// Calculate inner width accounting for box borders/padding
const innerWidth = getInnerWidth(boxConfig)

// Simple usage with a string
console.log(makeBox('Hello World'))

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

console.log('='.repeat(80))
console.log('WITH BACKGROUNDS (default)')
console.log('='.repeat(80))
const withBg = await formatDiff(sampleDiff, {
  width: 80,
  highlightLineChanges: true
})
console.log(withBg)

console.log('\n')
console.log('='.repeat(80))
console.log('WITHOUT DEFAULT BACKGROUND (disableDefaultBackground: true)')
console.log('='.repeat(80))
const noBg = await formatDiff(sampleDiff, {
  width: 80,
  highlightLineChanges: true,
  disableDefaultBackground: true
})
console.log(noBg)

console.log('innerWidth:', innerWidth)

const noTop = await formatDiff(sampleDiff, {
  width: innerWidth,
  hideFileHeader: true,
  hideHeaderTopLine: true,
  disableDefaultBackground: true
})

console.log('='.repeat(80))
console.log('WITHOUT Box LINE')
console.log('='.repeat(80))
console.log(noTop.trim())


console.log('='.repeat(80))
console.log('WITH BOX')
console.log('='.repeat(80))
console.log(makeBox({
  ...boxConfig,
  title: {
    left: '  a/handler.js',
    right: 'Changed  '
  },
  content: noTop.trim()
}))

boxConfig.borderStyle = 'transparent'

console.log(makeBox({
  ...boxConfig,
  title: {
    left: '  a/handler.js',
    right: 'Changed  '
  },
  content: noTop.trim()
}))
