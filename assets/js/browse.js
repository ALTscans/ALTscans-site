document.addEventListener('DOMContentLoaded', async () => {
  const seriesBoxes = document.querySelectorAll('.series-box');
  const nothingFound = document.querySelector('.error-msg');
  
  nothingFound.style.display = 'none';
  
  if(seriesBoxes.forEach(box => box.style.display = 'none')) {
    nothingFound.style.display = 'flex';
  }
  
  
  
  const dialogOverlay = document.getElementById('description-dialog');
  const dialogFullDesc = document.getElementById('full-description');
  const closeDialogBtn = document.getElementById('close-dialog');
  const seriesContainer = document.querySelector('.series-container');
  
  let genreSelection = []
  
  try {
    let getSeriesRes = await getSeries();
    console.log(getSeriesRes);
    
    getSeriesRes.forEach((series, index) => {
      console.log(series.manga_status);
      
      const seriesBox = document.createElement('div');
      seriesBox.classList.add('series-box');
      seriesBox.setAttribute('data-index', index);
      
      const bowContainer = series.manga_status === 'dropped' ? `
        <div class="bow-container">
          <p class="bow">Dropped</p>
        </div>
      ` : '';
      
      seriesBox.innerHTML += `
          ${bowContainer}
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
      `;
      
      seriesContainer.appendChild(seriesBox);
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

    let genreSelection = [];
    
    // Add genre selection functionality
    document.querySelectorAll('.genre-option').forEach(genre => {
        genre.addEventListener('click', function() {
            const genreValue = this.getAttribute('data-genre');
            
            // Toggle selected class
            this.classList.toggle('selected');
            
            if (this.classList.contains('selected')) {
                // Add genre to selection if not already present
                if (!genreSelection.includes(genreValue)) {
                    genreSelection.push(genreValue);
                }
            } else {
                // Remove genre from selection
                genreSelection = genreSelection.filter(genre => genre !== genreValue);
            }
            
            console.log('Selected genres:', genreSelection);
            // You can call a function here to filter series based on selected genres
            filterSeriesByGenres();
        });
    });

    // Function to filter series based on selected genres
    function filterSeriesByGenres() {
        const seriesBoxes = document.querySelectorAll('.series-box');
        let visibleCount = 0;
        
        if (genreSelection.length === 0) {
            // Show all series if no genres are selected
            seriesBoxes.forEach(box => {
                box.style.display = 'block';
            });
            nothingFound.style.display = 'none';
            return;
        }
    
        seriesBoxes.forEach((box, index) => {
            const series = getSeriesRes[index];
            const hasSelectedGenres = genreSelection.every(genre => 
                series.genre.includes(genre)
            );
            
            box.style.display = hasSelectedGenres ? 'block' : 'none';
            if (hasSelectedGenres) {
                visibleCount++;
            }
        });
        
        // Show/hide nothing found message based on visible count
        nothingFound.style.display = visibleCount === 0 ? 'flex' : 'none';
    }
    
    
    
    let yearFilter = "";
    
    // Add year selection functionality
    document.querySelectorAll('.year-option').forEach(year => {
        year.addEventListener('click', function() {
            const yearValue = this.getAttribute('data-year');
            
            // Remove 'selected' class from all year options
            document.querySelectorAll('.year-option').forEach(y => {
                y.classList.remove('selected');
            });
            
            // If clicking the same year that's already selected, clear the filter
            if (yearFilter === yearValue) {
                yearFilter = "";
            } else {
                // Add selected class to clicked year and update yearFilter
                this.classList.add('selected');
                yearFilter = yearValue;
            }
            
            console.log('Selected year:', yearFilter);
            filterSeriesByYear();
        });
    });
    
    // Function to filter series based on selected year
    function filterSeriesByYear() {
        const seriesBoxes = document.querySelectorAll('.series-box');
        let visibleCount = 0;
        
        if (yearFilter === "") {
            // Show all series if no year is selected
            seriesBoxes.forEach(box => {
                box.style.display = 'block';
            });
            nothingFound.style.display = 'none';
            return;
        }
    
        seriesBoxes.forEach((box, index) => {
            const series = getSeriesRes[index];
            const releaseYear = new Date(series.releaseDate).getFullYear().toString();
            
            const isVisible = (releaseYear === yearFilter);
            box.style.display = isVisible ? 'block' : 'none';
            if (isVisible) {
                visibleCount++;
            }
        });
        
        // Show/hide nothing found message based on visible count
        nothingFound.style.display = visibleCount === 0 ? 'flex' : 'none';
    }

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

