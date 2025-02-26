document.addEventListener("DOMContentLoaded", () => {
  async function handleDetails() {
    const seriesThumbnail = document.querySelector(".image-container");
    let bodyTitle = document.querySelector("h1.title"); // More specific selector for the body title
    let status = document.querySelector(".status");
    let tagList = document.querySelector(".tag-list");
    let description = document.querySelector(".description");
    let artistName = document.querySelector(".artist-name");
    let authorName = document.querySelector(".author-name");
    let publisherName = document.querySelector(".publisher-name");
    let releaseDate = document.querySelector(".release-date");
    let coverImage = document.querySelector(".image-container img"); // Add this line
    let chapterHeader = document.querySelector(".chapters-header");
    let chapterList = document.querySelector(".chapter-list");

    // Get current URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const nick = urlParams.get("series");
    const seriesId = urlParams.get("id");
    console.log(nick, seriesId);

    // Update URL to clean format without page reload
    if (nick && seriesId) {
      const newUrl = `/series/?series=${nick}&id=${seriesId}`;
      history.pushState({}, "", newUrl);
    }

    function formatTitle(title) {
      if (!title) return ""; // Add null check
      return title
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    if (!nick || !seriesId) {
      console.log(`Error: Missing URL parameters`);
      if (bodyTitle) {
        bodyTitle.textContent =
          "Error: Incorrect URL Format. Please check the URL and try again.";
      }
      return;
    }

    try {
      const response = await axios.get(
        `https://altscans-api.netlify.app/api/admin/getSeriesDetails/${seriesId}/${nick}`,
      );
      let series = response.data.seriesDetails;
      let releases = response.data.releases;
      console.log(series);
      console.log(releases);

      if (series && series.title) {
        let formattedTitle = formatTitle(series.title);
        // Update both titles
        if (bodyTitle) bodyTitle.textContent = formattedTitle;
        document.title = formattedTitle; // Update page title
      }

      if (authorName && series.author)
        authorName.textContent = formatTitle(series.author);
      if (releaseDate && series.releaseDate)
        releaseDate.textContent = formatDate(series.releaseDate);
      if (description && series.desc)
        description.textContent = formatTitle(series.desc);
      if (coverImage && series.thumbnail) coverImage.src = series.thumbnail;
      if (status && series.manga_status)
        status.textContent = formatTitle(series.manga_status);
      if (chapterHeader && series.chapterCount && chapterList) {
        chapterHeader.innerHTML = `
          <a href="/reader.html?id=${seriesId}&series=${nick}&chapter=1">
            <button class="button" id="read-first">READ FIRST</button>
          </a>
          <a href="/reader.html?id=${seriesId}&series=${nick}&chapter=${series.chapterCount}">
            <button class="button" id="read-last">READ LAST</button>
          </a>
        `;

        releases.forEach(release => {
          chapterList.innerHTML += `
            <div class="single-chapter five-grid" onclick="openChapter(${seriesId}, '${nick}', ${release.chapterNo})">
                <div class="chapter-image-wrap"><img class="chapter-thumbnail" src="${release.thumbnail}" alt=""></div>
                <div class="title-container">
                    <h3>Chapter ${release.chapterNo}</h3>
                    ${formatDate(release.uploadDate)}
                </div>
                <div class="button-container">
                    <button class="icon chapter-star"><img src="/assets/img/icons/star.svg" alt="ICON"></button>
                </div>
            </div>
          `;
        });
      }
    } catch (error) {
      console.error("Error fetching series details:", error);
    }
  }

  handleDetails();

// Handle browser back/forward buttons
window.addEventListener("popstate", handleDetails);
});

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

function openChapter(seriesId, nick, chapterNo) {
  window.location.href = `/reader.html?id=${seriesId}&series=${nick}&chapter=${chapterNo}`;
}