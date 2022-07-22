const { octokit } = require('./request');

const updateGist = (id, content) => {
    const { data: gist } = await octokit.rest.gists.get({ gist_id: id });
    const filename = Object.keys(gist.files)[0]
    const response = await octokit.rest.gists.update({ gist_id: id, files: { [filename]: content }, });
}