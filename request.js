const core = require('@actions/core');
const github = require('@actions/github');

let octokit;

((token) => {
    if (octokit) return octokit
    if(!token) throw new Error('Octokit not instantiated and no token provided')
    return octokit = github.getOctokit(token);
})(core.getInput('GITHUB_TOKEN'))

const getStats = async () => {
    const { data: { login: username } } = await octokit.rest.users.getAuthenticated();
    
    const { data: events } = core.getInput('includePrivate') ?
        await octokit.rest.activity.listEventsForAuthenticatedUser({username}) :
        await octokit.rest.activity.listPublicEventsForUser({username});
    return events
}

const updateGist = async (content) => {
    const { data: gist } = await octokit.rest.gists.get({
        gist_id: core.getInput('GIST_ID')
    });

    const filename = Object.keys(gist.files)[0]
    if(gist.files[filename].content !== content) {
        await octokit.rest.gists.update({
            gist_id: core.getInput('GIST_ID'),
            files: { [filename]: {content} },
        });
        return true
    }
    return false
}

module.exports = { getStats, updateGist }
