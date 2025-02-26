const baseUrl = `https://altscans-api.netlify.app`;

// Function to fetch latest releases from the API
async function fetchLatestReleases() {
  try {
    const response = await axios.get(`${baseUrl}/api/admin/getLatestUpdate`);
    console.log(response.data.latestReleases);

    // Check if the response is an array
    if (!Array.isArray(response.data.latestReleases)) {
      throw new Error("Expected an array of releases");
    }

    const latestReleases = response.data.latestReleases; // Adjust this based on the actual structure of your API response

    // Get the container where the latest releases will be displayed
    const releasesContainer = document.querySelector(".latest-releases-container");

    // Clear any existing content
    releasesContainer.innerHTML = "";
    releasesContainer.innerHTML = `<div class="section-header"><h2 class="section-title">LATEST RELEASES</h2></div>`;

    // Loop through the latest releases and create HTML elements
    latestReleases.forEach((release) => {
      function formatTitle(title) {
        return title
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }

      // Ensure the release object has the expected properties
      const thumbnail = release.thumbnail || "default-thumbnail.jpg"; // Fallback image
      const name = formatTitle(release.title) || "Unknown Title"; // Fallback title
      const nick = release.nick || `Unknown Nickname`;
      const chapterNo = release.chapterNo || "0";
      const prevChapter = release.previousChapter || "0";
      const lastChapter = prevChapter - 1 || "0";
      const manga = release.manga || "0";

      console.log(release);
      // Create a grid item for each release
      const gridItem = document.createElement("div");
      gridItem.className = "releases-grid";

      const itemContent = `
        <div class="release-card">
          <div class="card-content">
            <div class="series-info">
              <div class="cover-container">
                <img src="${thumbnail}" alt="${name}" class="cover-upload" />
                <button class="like-button" data-liked="false" aria-label="Like series" aria-pressed="false">♡</button>
              </div>
              <div class="series-details">
                <div class="series-title">${name}</div>
                <div class="star-rating" role="group" aria-label="Rate this series">
                  <button class="star" data-active="false" aria-label="Rate 1 star" aria-pressed="false">★</button>
                  <button class="star" data-active="false" aria-label="Rate 2 stars" aria-pressed="false">★</button>
                  <button class="star" data-active="false" aria-label="Rate 3 stars" aria-pressed="false">★</button>
                  <button class="star" data-active="false" aria-label="Rate 4 stars" aria-pressed="false">★</button>
                  <button class="star" data-active="false" aria-label="Rate 5 stars" aria-pressed="false">★</button>
                </div>
              </div>
            </div>
            <div class="chapter-container">
              <a href="/reader.html?id=${manga}&series=${nick}&chapter=${chapterNo}" class="chapter-link hvr-grow-shadow">
                <button class="chapter-btn-highlight" aria-label="Read chapter ${chapterNo}">READ CHAPTER ${chapterNo}</button>
              </a>
              <a href="/reader.html?id=${manga}&series=${nick}&chapter=${prevChapter}" class="chapter-link hvr-grow-shadow">
                <button class="chapter-btn" aria-label="Read chapter ${prevChapter}">READ CHAPTER ${prevChapter}</button>
              </a>
              <a href="/reader.html?id=${manga}&series=${nick}&chapter=${lastChapter}" class="chapter-link hvr-grow-shadow">
                <button class="chapter-btn" aria-label="Read chapter ${lastChapter}">READ CHAPTER ${lastChapter}</button>
              </a>
            </div>
          </div>
        </div>
      `;

      gridItem.innerHTML = itemContent;
      releasesContainer.appendChild(gridItem);

      // Add event listeners for redirection
      const coverContainer = gridItem.querySelector(".cover-container");
      const seriesTitle = gridItem.querySelector(".series-title");

      coverContainer.addEventListener("click", () => openSeries(manga, nick));
      seriesTitle.addEventListener("click", () => openSeries(manga, nick));
    });
  } catch (error) {
    console.error("Error fetching latest releases:", error);
    // Optionally, display an error message to the user
    const releasesContainer = document.getElementById("latest-releases");
    releasesContainer.innerHTML = "<p>Error loading latest releases. Please try again later.</p>";
  }
}

// Call the function to fetch and display the latest releases after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", fetchLatestReleases);

function openSeries(manga, nick) {
  window.location.href = `/series/?series=${nick}&id=${manga}`;
}
