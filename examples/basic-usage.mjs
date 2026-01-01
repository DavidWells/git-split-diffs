// Example: Basic formatDiff usage
import { formatDiff } from '../build/api.mjs'

const diff = `diff --git a/src/utils.js b/src/utils.js
index abc1234..def5678 100644
--- a/src/utils.js
+++ b/src/utils.js
@@ -1,8 +1,9 @@
 const config = require('./config')

-function getValue(key) {
-  return config[key]
+function getValue(key, defaultValue = null) {
+  return config[key] ?? defaultValue
 }

+const VERSION = '2.0.0'
+
 module.exports = { getValue }
`

const formatted = await formatDiff(diff, {
  width: 100,
  highlightLineChanges: true
})

console.log(formatted)
