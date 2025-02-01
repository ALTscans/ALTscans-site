// Function to fetch latest releases from the API
async function fetchLatestReleases() {
    try {
        const response = await axios.get('https://altscans-api.netlify.app/api/admin/getLatestUpdate');
      console.log(response.data.latestReleases);
        
        // Check if the response is an array
        if (!Array.isArray(response.data.latestReleases)) {
            throw new Error('Expected an array of releases');
        }

        const latestReleases = response.data.latestReleases; // Adjust this based on the actual structure of your API response

        // Get the container where the latest releases will be displayed
        const releasesContainer = document.querySelector('.latest-releases-container > .grid-container');

        // Clear any existing content
        releasesContainer.innerHTML = '';

        // Loop through the latest releases and create HTML elements
        let release = response.data.latestReleases;
        latestReleases.forEach(release => {
          function formatTitle(title) {
            return title
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
          }
            // Ensure the release object has the expected properties
            const thumbnail = release.thumbnail || 'default-thumbnail.jpg'; // Fallback image
            const name = formatTitle(release.title) || 'Unknown Title'; // Fallback title
            const nick = release.nick || `Unknown Nickname`;
            const chapterNo = release.chapterNo || '0';
            const prevChapter = release.previousChapter || '0';
            const lastChapter = prevChapter - 1 || '0';
            const manga = release.manga || '0';

          console.log(release);
            // Create a grid item for each release
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-row';
            gridItem.onclick = () => handleClick(release); // Assuming you have a handleClick function

            const itemContent = `
              <div class="grid-column">
                    <div class="release-item" data-series-id="series1">
                        <div class="item-header">
                            <div class="series-info">
                                <div class="series-thumbnail">
                                    <img loading="lazy" src="${thumbnail}" alt="${release.title} thumbnail" />
                                    <button class="heart-button" aria-label="Add to favorites">
                                        <svg class="heart-icon empty" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="white" stroke-width="2"/>
                                        </svg>
                                        <svg class="heart-icon filled" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white"/>
                                        </svg>
                                    </button>
                                </div>
                                <div class="series-title">${name}</div>
                                <div class="rating-container" data-rating="0">
                                    <div class="stars">
                                        <input type="radio" id="star5-series1" name="rating-series1" value="5" class="star-input" />
                                        <label for="star5-series1" class="star-label">
                                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                            </svg>
                                        </label>
                                        <input type="radio" id="star4-series1" name="rating-series1" value="4" class="star-input" />
                                        <label for="star4-series1" class="star-label">
                                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                            </svg>
                                        </label>
                                        <input type="radio" id="star3-series1" name="rating-series1" value="3" class="star-input" />
                                        <label for="star3-series1" class="star-label">
                                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                            </svg>
                                        </label>
                                        <input type="radio" id="star2-series1" name="rating-series1" value="2" class="star-input" />
                                        <label for="star2-series1" class="star-label">
                                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                            </svg>
                                        </label>
                                        <input type="radio" id="star1-series1" name="rating-series1" value="1" class="star-input" />
                                        <label for="star1-series1" class="star-label">
                                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                            </svg>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <button 
                                class="chapter-button" 
                                onclick="readChapter(${manga}, ${nick}, ${chapterNo})" 
                                aria-label="Read chapter ${release.chapterNo} of ${name}">
                                READ CHAP ${release.chapterNo}
                            </button>
                        </div>
                        <button 
                            class="chapter-link" 
                            onclick="readChapter(${manga}, ${nick}, ${prevChapter})" 
                            aria-label="Read chapter ${release.previousChapter} of ${nick}">
                            READ CHAP ${release.previousChapter}
                        </button>
                        <button 
                            class="chapter-link" 
                            onclick="readChapter(${manga}, ${nick}, ${lastChapter})" 
                            aria-label="Read chapter ${lastChapter} of series 1">
                            READ CHAP ${lastChapter}
                        </button>
                    </div>
                </div>
            `;

            gridItem.innerHTML = itemContent;
            releasesContainer.appendChild(gridItem);
        });
    } catch (error) {
        console.error('Error fetching latest releases:', error);
        // Optionally, display an error message to the user
        const releasesContainer = document.getElementById('latest-releases');
        releasesContainer.innerHTML = '<p>Error loading latest releases. Please try again later.</p>';
    }
}

// Call the function to fetch and display the latest releases after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', fetchLatestReleases);