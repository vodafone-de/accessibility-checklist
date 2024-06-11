document.addEventListener('DOMContentLoaded', () => {
    const repoUrl = 'https://api.github.com/repos/vodafone-de/accessibility-checklist/commits';
    const versionElement = document.getElementById('version');
    const changelogElement = document.getElementById('changelog');
    const orderSelect = document.getElementById('order');

    let version = { major: 3, minor: 0, fix: 4 };
    let commits = [];

    async function fetchCommits() {
        const response = await fetch(repoUrl);
        const commits = await response.json();
        return commits;
    }

    function updateVersion(commitMessage) {
        if (commitMessage.startsWith('Major')) {
            version.major += 1;
            version.minor = 0;
            version.fix = 0;
        } else if (commitMessage.startsWith('Minor')) {
            version.minor += 1;
            version.fix = 0;
        } else if (commitMessage.startsWith('Fix')) {
            version.fix += 1;
        }
    }

    function displayVersion() {
        versionElement.textContent = `Version: ${version.major}.${version.minor}.${version.fix}`;
    }

    function displayChangelog(commits, order = 'oldest') {
        changelogElement.innerHTML = '';
        const sortedCommits = [...commits];
        if (order === 'oldest') {
            sortedCommits.reverse();
        }
        sortedCommits.forEach(commit => {
            const li = document.createElement('li');
            li.textContent = commit.commit.message;
            changelogElement.appendChild(li);
        });
    }

    async function generateChangelog() {
        commits = await fetchCommits();
        commits.forEach(commit => {
            updateVersion(commit.commit.message);
        });
        displayVersion();
        displayChangelog(commits, orderSelect.value);
    }

    orderSelect.addEventListener('change', () => {
        displayChangelog(commits, orderSelect.value);
    });

    generateChangelog();
});
