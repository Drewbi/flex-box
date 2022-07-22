const core = require('@actions/core');
const { initAPI } = require('./request');

async function run() {
  const authToken = core.getInput('GITHUB_TOKEN');
  const results = await initAPI(authToken);
  return results;
}

run();
