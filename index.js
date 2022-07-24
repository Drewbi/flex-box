const core = require('@actions/core');
const { getOctokit } = require('./request')
const { getStats } = require('./utils')

async function run() {
  const authToken = core.getInput('GITHUB_TOKEN');
  getOctokit(authToken)
  const results = await getStats()
  return results
}

run();
