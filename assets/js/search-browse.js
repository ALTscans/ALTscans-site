// search-browse.js - Search functionality for ALTscans using browse.html

/**
 * Handles the search form submission and redirects to the browse page with search parameter
 * @param {Event} event - The form submission event
 */
function handleSearchSubmit(event) {
    if (event) {
        event.preventDefault();
    }
    
    const searchInput = document.querySelector('.search-bar input') || document.querySelector('.search-input');
    if (!searchInput) return;

    const searchQuery = searchInput.value.trim();
    
    if (searchQuery.length > 0) {
        // Redirect to browse page with the search query
        window.location.href = `/routes/browse?search=${encodeURIComponent(searchQuery)}`;
    } else {
        // Focus on the input if it's empty
        searchInput.focus();
    }
}

/**
 * Initialize the search functionality when the DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('.search-bar');
    const searchInput = document.querySelector('.search-bar input') || document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-bar button');
    
    if (searchForm && searchInput) {
        // Handle form submission (Enter key)
        searchForm.addEventListener('submit', handleSearchSubmit);
        
        // Handle search button click
        if (searchButton) {
            searchButton.addEventListener('click', handleSearchSubmit);
        }
        
        // Add keyboard shortcut (Ctrl+K or Cmd+K on Mac)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
            
            // ESC key to clear search
            if (e.key === 'Escape') {
                if (document.activeElement === searchInput) {
                    searchInput.value = '';
                    searchInput.blur();
                }
            }
        });
    }
    
    // If on the browse page, check for search para in already bullshit URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery && window.location.pathname.includes('/routes/browse')) {
        // Set the search input value to the query
        if (searchInput) {
            searchInput.value = searchQuery;
        }
        
        // Update page title to indicate search
        document.title = `Search: ${searchQuery} - ALTscans`;
        
        // If there's a header on the page, update it
        const pageHeader = document.querySelector('main h2');
        if (pageHeader) {
            pageHeader.textContent = `Search Results: "${searchQuery}"`;
        }
    }
});

// If we're using the header.html inclusion pattern, we need to initialize search
// after the header is loaded
if (document.getElementById('header-content')) {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // Check if our search elements have been added
                const searchForm = document.querySelector('.search-bar');
                const searchInput = document.querySelector('.search-bar input') || document.querySelector('.search-input');
                const searchButton = document.querySelector('.search-bar button');
                
                if (searchForm && searchInput && !searchForm.hasSearchListeners) {
                    // Handle form submission (Enter key)
                    searchForm.addEventListener('submit', handleSearchSubmit);
                    
                    // Handle search button click
                    if (searchButton) {
                        searchButton.addEventListener('click', handleSearchSubmit);
                    }
                    
                    // Mark that we've added listeners to avoid duplicates
                    searchForm.hasSearchListeners = true;
                }
            }
        });
    });
    
    observer.observe(document.getElementById('header-content'), { childList: true, subtree: true });
}