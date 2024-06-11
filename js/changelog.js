document.addEventListener('DOMContentLoaded', async () => {
    const apiUrl = 'https://api.github.com/repos/vodafone-de/accessibility-checklist/commits';
    const changelogContainer = document.getElementById('changelog-container');

    if (!changelogContainer) {
        console.error('Error: Changelog container element not found');
        return;
    }

    let major = 3;
    let minor = 0;
    let fix = 4;

    try {
        const response = await fetch(apiUrl);
        const commits = await response.json();

        let versions = [];
        let currentVersionCommits = [];
        let previousChanges = [];
        let currentVersionHeader = '';

        // Process commits in reverse order (oldest to newest)
        commits.reverse().forEach(commit => {
            const message = commit.commit.message;

            if (message.startsWith('Major')) {
                if (currentVersionCommits.length > 0) {
                    versions.push({ header: currentVersionHeader, commits: currentVersionCommits });
                    currentVersionCommits = [];
                }
                major++;
                minor = 0;
                fix = 0;
                currentVersionHeader = `Version ${major}.${minor}.${fix}`;
                currentVersionCommits.push(message);
            } else if (message.startsWith('Minor')) {
                if (currentVersionCommits.length > 0) {
                    versions.push({ header: currentVersionHeader, commits: currentVersionCommits });
                    currentVersionCommits = [];
                }
                minor++;
                fix = 0;
                currentVersionHeader = `Version ${major}.${minor}.${fix}`;
                currentVersionCommits.push(message);
            } else if (message.startsWith('Fix')) {
                fix++;
                currentVersionCommits.push(message);
            } else {
                if (currentVersionHeader === '') {
                    previousChanges.push(message);
                } else {
                    currentVersionCommits.push(message);
                }
            }
        });

        if (currentVersionCommits.length > 0) {
            versions.push({ header: currentVersionHeader, commits: currentVersionCommits });
        }

        // Render versions in the correct order (newest first)
        versions.reverse().forEach(version => {
            renderVersion(version.header, version.commits.reverse());
        });

        // Render previous changes last
        if (previousChanges.length > 0) {
            renderPreviousChanges(previousChanges.reverse());
        }

    } catch (error) {
        console.error('Error fetching commit data:', error);
    }

    function renderVersion(version, commits) {
        const versionHeader = document.createElement('div');
        versionHeader.className = 'version-header';
        versionHeader.textContent = version;
        changelogContainer.appendChild(versionHeader);

        // Render commits in correct order (newest first)
        commits.forEach(message => {
            const commitMessageElement = document.createElement('li');
            commitMessageElement.className = 'commit-message';
            commitMessageElement.textContent = message;
            changelogContainer.appendChild(commitMessageElement);
        });
    }

    function renderPreviousChanges(commits) {
        const previousChangesHeader = document.createElement('div');
        previousChangesHeader.className = 'version-header';
        previousChangesHeader.textContent = 'Previous changes';
        changelogContainer.appendChild(previousChangesHeader);

        // Render commits in correct order (newest first)
        commits.forEach(message => {
            const commitMessageElement = document.createElement('li');
            commitMessageElement.className = 'commit-message';
            commitMessageElement.textContent = message;
            changelogContainer.appendChild(commitMessageElement);
        });
    }
});
