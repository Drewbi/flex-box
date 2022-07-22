const github = require('@actions/github');

let octokit;

const initAPI = (token) => {
    octokit = github.getOctokit(token);
}

module.exports = { octokit, initAPI }

