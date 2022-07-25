const core = require('@actions/core');
const { voidify } = require('./zalgo')
const MAX_LINES = 20
const MAX_LENGTH = 63

const capitalize = str => str.slice(0, 1).toUpperCase() + str.slice(1)
const truncate = str =>
  str.match(/[a-zA-Z0-9]/g).length <= MAX_LENGTH ? str : str.slice(0, MAX_LENGTH - 3) + '...'

const redact = (str, publicEvent, isNumber) => {
    if (publicEvent) return str
    const length = Math.round(Math.random() * 8) + 6
    const randomString = isNumber ? Math.round(Math.random() * 150).toString() : Math.random().toString(36).slice(2).replace(/[^a-z^0-9]+/g, '').slice(0, length);
    const randomBoxes = randomString.replace(/./g, '█')
    return core.getInput('USE_ZALGO_REDACT') === 'true' ? voidify(randomString) : randomBoxes
}

const serializers = {
    WatchEvent: item => { // Currently starred repos are classed as watch events
        return `🌟 Starred repo: ${item.repo.name}`
    },
    IssueCommentEvent: item => {
        return `🗣 Commented on #${redact(item.payload.issue.number, item.public, true)} in ${redact(item.repo.name, item.public)}`
    },
    CreateEvent: item => {
        if(item.ref_type == 'repository')
        return `🆕 Created new repo: ${redact(item.repo.name, item.public)}`
        else
        return `⑂ Created branch ${redact(item.payload.ref, item.public)} in repo: ${redact(item.repo.name, item.public)}`
    },
    ForkEvent: item => {
        return `ᛘ Forked repo: ${redact(item.repo.name, item.public)}`
    },
    IssuesEvent: item => {
        return `❗️ ${capitalize(item.payload.action)} issue #${
            redact(item.payload.issue.number, item.public, true)
        } in ${redact(item.repo.name, item.public)}`
    },
    PullRequestEvent: item => {
        const emoji = item.payload.action === 'opened' ? '🆒' : '❌'
        const line = item.payload.pull_request.merged
        ? '🎉 Merged'
        : `${emoji} ${capitalize(item.payload.action)}`
        return `${line} PR #${redact(item.payload.pull_request.number, item.public, true)} in ${
            redact(item.repo.name, item.public)
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
      .filter(event => serializers[event.type])
      .slice(0, MAX_LINES - 1)
      .map(item => serializers[item.type](item))
      .map(truncate)
}

const getCombinedText = (events) => {
    return [getCommitText(events), ...getEventText(events)].join('\n')
}

module.exports = { getCombinedText }