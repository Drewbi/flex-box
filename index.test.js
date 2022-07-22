require('dotenv').config();
const { getStats } = require('./utils');
// const process = require('process');
// const cp = require('child_process');
// const path = require('path');

test('returns data', async () => {
  const results = await getStats(process.env.GITHUB_TOKEN)
  console.log(results);
})

// shows how the runner will run a javascript action with env / stdout protocol
// test('test runs', () => {
//   const ip = path.join(__dirname, 'index.js');
//   console.log(process.env)
//   const result = cp.execSync(`node ${ip}`, {env: process.env, secrets: { GITHUB_TOKEN: process.env.GITHUB_TOKEN }}).toString();
//   console.log(result);
// })
