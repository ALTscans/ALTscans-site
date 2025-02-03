let basedbUrl = "https://altscans-api.netlify.app";

document.addEventListener('DOMContentLoaded', function() {
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const chapterNo = urlParams.get('chapter');
  const seriesName = urlParams.get('series');
  const seriesId = urlParams.get('id');

  function formatTitle(title) {
    return title
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  if (!chapterNo || !seriesName || !seriesId) { 
    console.log(`Error: Missing URL parameters`);
    
    let header = document.querySelector('.chapter-title');
    if (header) {
      header.textContent = 'Error: Missing URL parameters';
    }
  }
  
  let series = axios.get(`${basedbUrl}/api/admin/getSeries/${seriesId}/${seriesName}/${chapterNo}`, {})
    .then(function (response) {
      console.log(response)
      let header = document.getElementsByClassName('chapter-title');
      let chapterNoHeader = document.getElementById('current-chapter');
      let chapterNameHeader = document.getElementById('current-chapter-name');
      let chapterDropdown = document.getElementById('chapter-select');
      if(!chapterNoHeader || !chapterNameHeader) {
        // If Chapter No. doesn't exist, spawn it in
        chapterNoHeader = document.createElement('div');
        chapterNoHeader.id = 'current-chapter';

        // If Chapter Name doesn't exist, spawn it in
        chapterNameHeader = document.createElement('div');
        chapterNameHeader.id = 'current-chapter-name';

        // Add them to the header if it exists
        if (header && header[0]) {
          header[0].appendChild(chapterNoHeader);
          header[0].appendChild(chapterNameHeader);
        }
      }

      // Update the chapter information
      chapterNoHeader.textContent = `Chapter ${chapterNo}`;
      chapterNameHeader.textContent = formatTitle(response.data.seriesDetails.title);


      
      let imageContainer = document.querySelector('.chapter-content');
      if (!imageContainer) {
        // If the container doesn't exist, create it
        imageContainer = document.createElement('div');
        imageContainer.className = 'chapter-content';
        const readerContent = document.querySelector('.reader-content');
        if (readerContent) {
          readerContent.appendChild(imageContainer);
        } else {
          document.body.appendChild(imageContainer);
        }
      }
      const imagesHTML = response.data.resources.map((imageUrl, index) => 
        `<img src="${imageUrl}" alt="Chapter 73 Page ${index + 1}" class="chapter-image">`
      ).join('');
      imageContainer.innerHTML = imagesHTML;
    })
    .catch(function (error) {
      console.log(`error: `, error);
      let errorRes = error.response.request.response;
      
      if (errorRes) {
        
        let header = document.querySelector('.chapter-title');
        if (header) {
          header.textContent = `Error: An Error Has Occured. Error: ${errorRes}`;
        }
      }
    });

  console.log(`Series Log:`, series);
  
  var disqus_config = function () {
      this.page.url = window.location.href;  // Use current page URL
      this.page.identifier = `${seriesName}-chapter-${chapterNo}`; // Create unique identifier based on series and chapter
  };

  (function() { // DON'T EDIT BELOW THIS LINE
  var d = document, s = d.createElement('script');
  s.src = 'https://altscan.disqus.com/embed.js';
  s.setAttribute('data-timestamp', +new Date());
  (d.head || d.body).appendChild(s);
  })();
});

