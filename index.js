const { getStats, updateGist } = require('./request');
const { getCombinedText } = require('./utils');

async function run() {
  const events = await getStats()
  const text = getCombinedText(events)
  const updated = await updateGist(text)
  updated ? console.log('Gist was updated') : console.log('No updates')
}

run();
