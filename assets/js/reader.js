if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch((error) => {
      console.log('ServiceWorker registration failed: ', error);
    });
  });
}

let basedbUrl = base_url;

document.addEventListener('DOMContentLoaded', () => {
  const chaptersRead = localStorage.getItem('chaptersRead') ? JSON.parse(localStorage.getItem('chaptersRead')) : [];
  
  const urlParams = new URLSearchParams(window.location.search);
  const chapterSelect = document.querySelector('.chapter-select');
  const prevButtons = document.querySelectorAll('.prev-chapter');
  const nextButtons = document.querySelectorAll('.next-chapter');
  const currentChapterSpan = document.getElementById('current-chapter');
  const currentChapterName = document.getElementById('current-chapter-name');
  const chapterContent = document.querySelector('.chapter-content');
  
  let currentChapter = parseInt(urlParams.get('chapter'));
  const seriesName = urlParams.get('series');
  const seriesId = urlParams.get('id');

  function formatTitle(title) {
    return title
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  if (!currentChapter || !seriesName || !seriesId) {
    console.log(`Error: Missing URL parameters`);

    let header = document.querySelector('.chapter-title');
    if (header) {
      header.textContent = 'Error: Missing URL parameters';
    }
    return;
  }

  // IndexedDB utility functions
  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('chapterCacheDB', 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('chapters')) {
          db.createObjectStore('chapters', { keyPath: 'key' }); // Key format: `${seriesId}-${chapter}`
        }
      };

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
    });
  }

  async function saveChapterToIndexedDB(key, data) {
    const db = await openDatabase();
    const transaction = db.transaction('chapters', 'readwrite');
    const store = transaction.objectStore('chapters');

    store.put({ key, data });

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) => reject(event.target.error);
    });
  }

  async function getChapterFromIndexedDB(key) {
    const db = await openDatabase();
    const transaction = db.transaction('chapters', 'readonly');
    const store = transaction.objectStore('chapters');

    return new Promise((resolve, reject) => {
      const request = store.get(key);

      request.onsuccess = (event) => resolve(event.target.result?.data || null);
      request.onerror = (event) => reject(event.target.error);
    });
  }

  async function updateChapterUI(chapterData, chapter) {
    if (!chapterData) return;

    // Update navigation buttons
    const maxChapter = chapterData.seriesDetails.maxChaptersUploaded;
    prevButtons.forEach(button => button.disabled = chapter <= 1);
    nextButtons.forEach(button => button.disabled = chapter >= maxChapter);
    
    // Populate chapter select
    const chapters = Array.from({ length: maxChapter }, (_, i) => `
      <option value="${i + 1}" ${i + 1 == currentChapter ? 'selected' : ''}>
        Chapter ${i + 1}
      </option>
    `).join('');
    
    chapterSelect.innerHTML = chapters;


    // Update chapter images
    const images = chapterData.resources.map((imgUrl, index) => `
      <img 
        src="${imgUrl}" 
        alt="Chapter ${chapter} Page ${index + 1}" 
        class="chapter-image"
        loading="${index === 0 ? 'eager' : 'lazy'}"
      >
    `).join('');
    
    chapterContent.innerHTML = images;

    // Update URL and browser history
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('chapter', chapter);
    history.pushState(
      {chapter}, 
      `Chapter ${chapter} - ${seriesName.toUpperCase()}`,
      newUrl.toString()
    );
    
    document.title = `Chapter ${chapter} - ${seriesName.toUpperCase()}`;
    currentChapterSpan.innerHTML = `${chapter}`;
    currentChapterName.innerHTML = `${formatTitle(chapterData.seriesDetails.title)}`;
    chapterSelect.value = chapter;
    
    // Update comments section
    updateCommentsSection(chapter);
  }

  async function loadChapter(seriesId, seriesName, chapter) {
    const cacheKey = `${seriesId}-${chapter}`;
    const cachedChapter = await getChapterFromIndexedDB(cacheKey);

    if (cachedChapter) {
      console.log(`Loaded chapter ${chapter} from cache.`);
      updateChapterUI(cachedChapter, chapter);
    } else {
      console.log(`Fetching chapter ${chapter} from API.`);
      axios.get(`${basedbUrl}/api/admin/getSeries/${seriesId}/${seriesName}/${chapter}`)
        .then(async response => {
          const chapterData = response.data;

          // Cache the chapter data
          await saveChapterToIndexedDB(cacheKey, chapterData);

          // Update the UI
          updateChapterUI(chapterData, chapter);
        })
        .catch(error => console.error('Error fetching chapter:', error));
    }
  }

  function navigateChapter(direction) {
    const newChapter = currentChapter + direction;
    currentChapter = newChapter;
    loadChapter(seriesId, seriesName, newChapter);
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  function updateCommentsSection(chapter) {
    // Update Disqus configuration
    var disqus_config = function () {
      this.page.url = window.location.href;  // Use current page URL
      this.page.identifier = `${seriesName}-chapter-${chapter}`; // Create unique identifier based on series and chapter
    };

    // Reload Disqus script
    (function() {
      var d = document, s = d.createElement('script');
      s.src = 'https://altscan.disqus.com/embed.js';
      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
    })();

    // Update Facebook comments
    document.querySelector('.fb-comments').setAttribute('data-href', window.location.href);
    FB.XFBML.parse(); // Reparse the Facebook comments plugin
  }

  // Initial load
  loadChapter(seriesId, seriesName, currentChapter);

  // Set up event listeners
  chapterSelect.addEventListener('change', (e) => {
    currentChapter = parseInt(e.target.value);
    loadChapter(seriesId, seriesName, currentChapter);
    window.scrollTo({top: 0, behavior: 'smooth'});
  });

  prevButtons.forEach(button => {
    button.addEventListener('click', () => navigateChapter(-1));
  });

  nextButtons.forEach(button => {
    button.addEventListener('click', () => navigateChapter(1));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') navigateChapter(-1);
    else if (e.key === 'ArrowRight') navigateChapter(1);
  });

  window.addEventListener('popstate', (e) => {
    if (e.state && typeof e.state.chapter === 'number') {
      currentChapter = e.state.chapter;
      loadChapter(seriesId, seriesName, currentChapter);
    }
  });
});
