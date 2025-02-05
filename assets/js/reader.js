document.addEventListener('DOMContentLoaded', () => {
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

  async function loadChapterContent(chapter) {
    try {
      const response = await axios.get(`${basedbUrl}/api/admin/getSeries/${seriesId}/${seriesName}/${chapter}`);
      return response.data;
    } catch (error) {
      console.error('Error loading chapter:', error);
      return null;
    }
  }

  
  async function updateChapterUI(chapter) {
    const chapterData = await loadChapterContent(chapter);
    if (!chapterData) return;


    // Update navigation buttons
    const maxChapter = chapterData.seriesDetails.maxChaptersUploaded;
    prevButtons.forEach(button => button.disabled = chapter <= 1);
    nextButtons.forEach(button => button.disabled = chapter >= maxChapter);

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
  }

  function navigateChapter(direction) {
    const newChapter = currentChapter + direction;
    currentChapter = newChapter;
    updateChapterUI(newChapter);
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  // Initial load
  axios.get(`${basedbUrl}/api/admin/getSeries/${seriesId}/${seriesName}/${currentChapter}`)
    .then(response => {
      const maxChapter = response.data.seriesDetails.maxChaptersUploaded;
      
      // Populate chapter select
      const chapters = Array.from({length: maxChapter}, (_, i) => i + 1);
      chapterSelect.innerHTML = chapters.map(chapter => `
        <option value="${chapter}" ${chapter == currentChapter ? 'selected' : ''}>
          Chapter ${chapter}
        </option>
      `).join('');

      // Set up event listeners
      chapterSelect.addEventListener('change', (e) => {
        currentChapter = parseInt(e.target.value);
        updateChapterUI(currentChapter);
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
          updateChapterUI(currentChapter);
        }
      });

      // Initial chapter load
      updateChapterUI(currentChapter);
    })
    .catch(error => console.error('Error initializing reader:', error));
});