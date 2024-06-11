document.addEventListener('DOMContentLoaded', () => {
    const repoUrl = 'https://api.github.com/repos/vodafone-de/accessibility-checklist/commits';
    const versionElement = document.getElementById('version');
    const changelogElement = document.getElementById('changelog');
    const orderSelect = document.getElementById('order');

    let version = { major: 0, minor: 0, fix: 0 };
    let commits = [];
    let versions = [];

    const sortStrategies = {
        oldest: (commits) => [...commits].reverse(),
        messageLength: (commits) => [...commits].sort((a, b) => a.commit.message.length - b.commit.message.length),
        customTag: (commits) => [...commits].sort((a, b) => {
            const aTag = a.commit.message.match(/#(\w+)/);
            const bTag = b.commit.message.match(/#(\w+)/);
            return (aTag ? aTag[1] : '').localeCompare(bTag ? bTag[1] : '');
        })
    };

    async function fetchCommits() {
        const response = await fetch(repoUrl);
        return await response.json();
    }

    function updateVersion(commitMessage) {
        if (commitMessage.startsWith('Major')) {
            version.major += 1;
            version.minor = 0;
            version.fix = 0;
            versions.push({ ...version });
        } else if (commitMessage.startsWith('Minor')) {
            version.minor += 1;
            version.fix = 0;
            versions.push({ ...version });
        } else if (commitMessage.startsWith('Fix')) {
            version.fix += 1;
        }
    }

    function displayVersion() {
        versionElement.textContent = `Version: ${version.major}.${version.minor}.${version.fix}`;
    }

    function sortCommits(commits, order) {
        if (sortStrategies[order]) {
            return sortStrategies[order](commits);
        }
        return commits;
    }

    function createVersionHeader(version) {
        const versionHeader = document.createElement('h5');
        versionHeader.textContent = `Version ${version.major}.${version.minor}`;
        versionHeader.classList.add('white-text');
        return versionHeader;
    }

    function displayChangelog(commits, order = 'oldest') {
        changelogElement.innerHTML = '';
        const sortedCommits = sortCommits(commits, order);

        let currentVersionIndex = -1;
        let previousChanges = [];
        let isPreviousChangesSectionAdded = false;

        sortedCommits.forEach((commit, index) => {
            const commitMessage = commit.commit.message;

            if (commitMessage.startsWith('Major') || commitMessage.startsWith('Minor')) {
                currentVersionIndex++;
                const versionHeader = createVersionHeader(versions[currentVersionIndex]);
                changelogElement.appendChild(versionHeader);
            }

            const li = document.createElement('li');
            li.textContent = commitMessage;

            if (commitMessage.startsWith('Major') || commitMessage.startsWith('Minor')) {
                changelogElement.appendChild(li);
            } else {
                previousChanges.push(li);
            }
        });

        if (previousChanges.length > 0) {
            const previousHeader = document.createElement('h5');
            previousHeader.textContent = 'Previous changes';
            previousHeader.classList.add('white-text');
            changelogElement.appendChild(previousHeader);

            previousChanges.forEach(li => {
                changelogElement.appendChild(li);
            });
        }
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
