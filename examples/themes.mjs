// Example: Different themes
import { formatDiff } from '../build/api.mjs'

const diff = `diff --git a/app.js b/app.js
index 1234567..abcdefg 100644
--- a/app.js
+++ b/app.js
@@ -1,3 +1,3 @@
 const express = require('express')
-const port = 3000
+const port = process.env.PORT || 8080
 const app = express()
`

const themes = ['dark', 'light', 'github-dark-dim', 'github-light', 'solarized-dark', 'monochrome-dark']

for (const theme of themes) {
  console.log('='.repeat(80))
  console.log(`THEME: ${theme}`)
  console.log('='.repeat(80))
  const output = await formatDiff(diff, {
    width: 80,
    themeName: theme,
    highlightLineChanges: true
  })
  console.log(output)
  console.log()
}
