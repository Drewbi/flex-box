const { getOctokit } = require('./request')

const updateGist = async (id, content) => {
    const octokit = getOctokit()
    const { data: gist } = await octokit.rest.gists.get({ gist_id: id });
    const filename = Object.keys(gist.files)[0]
    const response = await octokit.rest.gists.update({ gist_id: id, files: { [filename]: content }, });
    return response
}

module.exports = { updateGist }