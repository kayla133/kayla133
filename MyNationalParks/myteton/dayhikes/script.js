document.addEventListener('DOMContentLoaded', function () {
    // 1. Select the menu toggle button and the navigation links list
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Check if both elements exist before adding the listener
    if (menuToggle && navLinks) {
        // 2. Add an event listener to the menu button
        menuToggle.addEventListener('click', function () {
            // 3. Toggle the 'active' class on the navigation links list
            navLinks.classList.toggle('active');

            // Optional: Update the button's text (hamburger/X icon)
            const isExpanded = navLinks.classList.contains('active');
            menuToggle.innerHTML = isExpanded ? '✕' : '☰';
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
    }
});