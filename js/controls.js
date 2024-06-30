document.addEventListener('DOMContentLoaded', (event) => {
    const dropdownButton = document.getElementById('dropdownButton');
    const dropdownMenu = document.getElementById('dropdownMenu');

    dropdownButton.addEventListener('click', () => {
        const isExpanded = dropdownButton.getAttribute('aria-expanded') === 'true';
        dropdownButton.setAttribute('aria-expanded', !isExpanded);
        dropdownMenu.style.display = isExpanded ? 'none' : 'block';
        dropdownMenu.setAttribute('aria-hidden', isExpanded);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeDropdown();
        }
    });

    document.addEventListener('click', (event) => {
        if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
            closeDropdown();
        }
    });

    function closeDropdown() {
        dropdownButton.setAttribute('aria-expanded', 'false');
        dropdownMenu.style.display = 'none';
        dropdownMenu.setAttribute('aria-hidden', 'true');
    }

    // Keyboard accessibility for dropdown items
    const menuItems = dropdownMenu.querySelectorAll('button');
    let currentIndex = -1;

    dropdownButton.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            currentIndex = (currentIndex + 1) % menuItems.length;
            menuItems[currentIndex].focus();
        }
    });

    menuItems.forEach((item, index) => {
        item.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                currentIndex = (index + 1) % menuItems.length;
                menuItems[currentIndex].focus();
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                currentIndex = (index - 1 + menuItems.length) % menuItems.length;
                menuItems[currentIndex].focus();
            }
        });
    });
});
