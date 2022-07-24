const github = require('@actions/github');

let octokit;

const getOctokit = (token) => {
    if (octokit) return octokit
    if(!token) throw new Error('Octokit not instantiated and no token provided')
    return octokit = github.getOctokit(token);
}

module.exports = { getOctokit }
