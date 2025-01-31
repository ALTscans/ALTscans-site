const baseApiUrl = 'https://altscans-api.netlify.app/api';
async function loadLatestReleases() {
  let response = await axios.get(`${baseApiUrl}/admin/getLatestUpdate`);
  console.log(response.data.latestReleases);
  let latestReleases = response.data.latestReleases;
  console.log(response.data.latestReleases[0].thumbnail);
  
  let latestReleasesContainer = document.getElementById('latest-releases');
  let mobileRootDiv = document.getElementsByClassName('releases-grid');
  
  let mobileLatestReleasesDiv = `<div class="release-card">
  <div class="card-content">
  <div class="series-info">
  <div class="cover-container">
  </div>
  </div>
  <div class="series-details">
  <div class="series-title">SERIES NAME...</div>
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
  <button class="chapter-btn-highlight" aria-label="Read chapter 3">READ CHAP 3</button>
  <button class="chapter-btn" aria-label="Read chapter 2">READ CHAP 2</button>
  <button class="chapter-btn" aria-label="Read chapter 1">READ CHAP 1</button>
  </div>
  </div>
  </div>
`;
  
  let coverContainer = document.getElementsByClassName('cover-container');
  coverContainer.appedChild(`<img src="${response.data.latestReleases[0].thumbnail}" alt="Series 1 thumbnail" />`);
  
  let desktopLatestReleasesDiv = `<div class="grid-column">
      <div class="release-item" data-series-id="series1">
          <div class="item-header">
              <div class="series-info">
                  <div class="series-thumbnail">
                      <img loading="lazy" src="./assets/img/series/series1.jpg" alt="Series 1 thumbnail" />
                      <button class="heart-button" aria-label="Add to favorites">
                          <svg class="heart-icon empty" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="white" stroke-width="2"/>
                          </svg>
                          <svg class="heart-icon filled" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white"/>
                          </svg>
                      </button>
                  </div>
                  <div class="series-title">SERIES NAME...</div>
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
                  onclick="readChapter('series1', 3)" 
                  aria-label="Read chapter 3 of series 1">
                  READ CHAP 3
              </button>
          </div>
          <button 
              class="chapter-link" 
              onclick="readChapter('series1', 2)" 
              aria-label="Read chapter 2 of series 1">
              READ CHAP 2
          </button>
          <button 
              class="chapter-link" 
              onclick="readChapter('series1', 1)" 
              aria-label="Read chapter 1 of series 1">
              READ CHAP 1
          </button>
      </div>
  </div>`
}

loadLatestReleases();