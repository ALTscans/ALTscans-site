document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const chapterSelect = document.querySelector('.chapter-select');
  const prevButtons = document.querySelectorAll('.prev-chapter');
  const nextButtons = document.querySelectorAll('.next-chapter');
  const currentChapterSpan = document.getElementById('current-chapter');
  const chapterContent = document.querySelector('.chapter-content');
    
  let currentChapter = parseInt(urlParams.get('chapter'));
  const seriesName = urlParams.get('series');
  const seriesId = urlParams.get('id');
  const chapterNo = urlParams.get('chapter');
    
  let series = axios.get(`${basedbUrl}/api/admin/getSeries/${seriesId}/${seriesName}/${chapterNo}`, {})
    .then(function (response) {
      const maxChapter = response.data.chapterNo;
      const minChapter = 0;
      
      // Populate the chapter select dropdown
      chapterSelect.innerHTML = chapterNo.map(ch => 
                  <option value="${ch.number}">Chapter ${ch.number}</option>
              ).join('');
      
              if (chapterNo.length) {
                [currentChapter.textContent] = [chapterNo[0].number, chapterNo[0].title];
              }
      
              chapterSelect.addEventListener('change', ({ target }) => {
                  const selected = chapterNo.find(ch => ch.number == target.value);
                  if (selected) {
                      [currentChapter.textContent] = [selected.number, selected.title];
                  }
              });
      
      function updateChapterUI(chapter) {
          currentChapterSpan.textContent = chapter;
          chapterSelect.value = chapter;
          
          prevButtons.forEach(button => button.disabled = chapter <= minChapter);
          nextButtons.forEach(button => button.disabled = chapter >= maxChapter);
          
          const images = [];
          for (let i = 1; i <= 3; i++) {
              images.push(`
                  <img 
                      src="chapter-${chapter}-page-${i}.jpg" 
                      alt="Chapter ${chapter} Page ${i}" 
                      class="chapter-image"
                      loading="${i === 1 ? 'eager' : 'lazy'}"
                  >
              `);
          }
          
          chapterContent.innerHTML = images.join('');
          
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.set('chapter', chapter);
          newUrl.searchParams.set('series', seriesName);
          newUrl.searchParams.set('id', seriesId);
          
          history.pushState(
              {chapter}, 
              `Chapter ${chapter} - ${seriesName.toUpperCase()}`,
              newUrl.toString()
          );
          
          document.title = `Chapter ${chapter} - ${seriesName.toUpperCase()}`;
      }
  
      function navigateChapter(direction) {
          const newChapter = currentChapter + direction;
          if (newChapter >= minChapter && newChapter <= maxChapter) {
              currentChapter = newChapter;
              updateChapterUI(currentChapter);
              window.scrollTo({top: 0, behavior: 'smooth'});
          }
      }
  
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
          if (e.key === 'ArrowLeft') {
              navigateChapter(-1);
          } else if (e.key === 'ArrowRight') {
              navigateChapter(1);
          }
      });
  
      window.addEventListener('popstate', (e) => {
          if (e.state && typeof e.state.chapter === 'number') {
              currentChapter = e.state.chapter;
              updateChapterUI(currentChapter);
          }
      });
  
      updateChapterUI(currentChapter);
  

  });
});
