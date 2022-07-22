const { octokit } = require('./request')

const getStats = async () => {
    const { data } = await octokit.rest.activity.listPublicEvents();
    return data;
}

const MAX_LINES = 20
const MAX_LENGTH = 63

const capitalize = str => str.slice(0, 1).toUpperCase() + str.slice(1)
const truncate = str =>
  str.length <= MAX_LENGTH ? str : str.slice(0, MAX_LENGTH - 3) + '...'

const serializers = {
    WatchEvent: item => {
        return `🌟 Starred repo: ${item.repo.name}`
    },
    IssueCommentEvent: item => {
        return `🗣 Commented on #${item.payload.issue.number} in ${item.repo.name}`
    },
    CreateEvent: item => {
        if(item.ref_type == 'repository')
        return `🆕 Created new repo: ${item.repo.name}`
        else
        return `⑂ Created branch ${item.payload.ref} in repo: ${item.repo.name}`
    },
    ForkEvent: item => {
        return `ᛘ Forked repo: ${item.repo.name}`
    },
    IssuesEvent: item => {
        return `❗️ ${capitalize(item.payload.action)} issue #${
        item.payload.issue.number
        } in ${item.repo.name}`
    },
    PullRequestEvent: item => {
        const emoji = item.payload.action === 'opened' ? '🆒' : '❌'
        const line = item.payload.pull_request.merged
        ? '🎉 Merged'
        : `${emoji} ${capitalize(item.payload.action)}`
        return `${line} PR #${item.payload.pull_request.number} in ${
        item.repo.name
        }`
    }
}

const getCommitText = (events) => {
    const commits = events.filter(event => {
        const eventDate = new Date(event.created_at)
        // Return true if event is less than 1 week old
        return Date.now() - eventDate.getTime() < 7 * 24 * 60 * 60 * 1000
    })
    .filter(event => event.type === 'PushEvent')

    const commitCounter = (total, commit) => total + commit.payload.size
    const commitNum = commits.reduce(commitCounter, 0)

    return `💻 ${ commitNum === 0 ? 'No' : 'Pushed'} ${ commitNum } commit${commitNum > 1 ? 's' : ''} in the last week`
}

const getEventText = (events) => {
    return events
      // Filter out any boring activity
      .filter(event => serializers[event.type])
      // We only have four lines to work with for other info
      .slice(0, MAX_LINES - 1)
      // Call the serializer to construct a string
      .map(item => serializers[item.type](item))
      // Truncate if necessary
      .map(truncate)
}

const getCombinedText = (events) => {
    return [getCommitText, ...getEventText(events)].join('\n')
}

module.exports = { getStats, getCombinedText }