require('dotenv').config();
// const { getStats, updateGist } = require('./request')
const { getCombinedText } = require('./utils')
const mockResponse = require('./mock')

// const process = require('process');
// const cp = require('child_process');
// const path = require('path');

// Unit tests
test('correct output', () => {
  const correctText = `💻 Pushed 133 commits in the last week
🆒 Opened PR #22 in other_user/repo
❌ Closed PR #29 in github/core
❌ Closed PR #103 in github/core
❌ Closed PR #85 in something/broken
🌟 Starred repo: current_user/repo
ᛘ Forked repo: current_user/repo
🗣 Commented on #2 in current_user/repo
🌟 Starred repo: really_cool/repo`

  const text = getCombinedText(mockResponse)
  expect(text).toBe(correctText)
})

test('redact output', () => {
  const text = getCombinedText(mockResponse)
  console.log(text)
})

// \/ Below requires INPUT_GITHUB_TOKEN and INPUT_GIST_ID in a .env file

// Integration tests
// test('returns data', async () => {
//   const events = await getStats()
//   const text = getCombinedText(events)
//   console.log(text)
// })

// test('updates gist', async () => {
//   const text = getCombinedText(mockResponse)
//   console.log(text)
//   const updated = updateGist(text)
//   return updated
// })

//End to end
// shows how the runner will run a javascript action with env / stdout protocol
// test('test runs', () => {
//   const ip = path.join(__dirname, 'index.js');
//   const result = cp.execSync(`node '${ip}'`, {env: process.env}).toString();
//   console.log(result);
// })
