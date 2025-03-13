document.addEventListener('DOMContentLoaded', async () => {
  const dialogOverlay = document.getElementById('description-dialog');
  const dialogFullDesc = document.getElementById('full-description');
  const closeDialogBtn = document.getElementById('close-dialog');
  const seriesContainer = document.querySelector('.series-container');

  try {
    let getSeriesRes = await getSeries();
    console.log(getSeriesRes);

    getSeriesRes.forEach((series, index) => {
      seriesContainer.innerHTML += `
        <div class="series-box" data-index="${index}">
          <div class="series-thumbnail">
            <img src="${series.thumbnail}" alt="${formatTitle(series.title)}">
          </div>
          <h3><strong>${formatTitle(series.title)}</strong></h3>
          <br/>
          <p class="series-description">
            ${truncateDescription(series.desc, 5)}
            <span class="read-more" data-full="${escapeHtml(series.desc).replace(/\n/g, '<br>')}">
              Read more
            </span>
          </p>
          <span class="bookmark">
            <svg class="bookmark-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </span>
        </div>
      `;
    });

    // Attach event listeners after elements are added to the DOM
    document.querySelectorAll('.series-box').forEach(box => {
      box.addEventListener('click', (event) => {
        const index = box.getAttribute('data-index');
        const series = getSeriesRes[index];
        openSeries(series.manga, series.nick);
      });
    });

    document.querySelectorAll('.read-more').forEach(el => {
      el.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent the click from propagating to the series box
        dialogFullDesc.innerHTML = this.getAttribute('data-full');
        dialogOverlay.classList.add('active');
      });
    });

    document.querySelectorAll('.bookmark').forEach(async (bookmarkEl, index) => {
      const series = getSeriesRes[index];
      const bookmarkBtn = bookmarkEl.querySelector('.bookmark-icon');

      // Check if the series is already bookmarked
      if (await checkIfBookmarked(series)) {
        bookmarkBtn.classList.add('bookmarked');
        bookmarkBtn.classList.add('active');
        bookmarkBtn.setAttribute('aria-label', 'Unbookmark this series');
      }

      bookmarkEl.addEventListener('click', async (e) => {
        e.stopPropagation();
        await handleBookmarkClick(bookmarkBtn, series);
      });
    });

  } catch (error) {
    console.error(error);
  }

  document.querySelectorAll('.filter-button').forEach(button => {
    button.addEventListener('click', function () {
      const dropdown = this.querySelector('.dropdown');
      dropdown.classList.toggle('active');
    });
  });

  closeDialogBtn.addEventListener('click', () => {
    dialogOverlay.classList.remove('active');
  });
});

async function getSeries() {
  try {
    const response = await axios.get(`${base_url}/api/admin/getAllSeries`);
    return response.data.series[0].mangas;
  } catch (error) {
    console.error(error);
  }
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function truncateDescription(desc, wordLimit) {
  const words = desc.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return desc;
}