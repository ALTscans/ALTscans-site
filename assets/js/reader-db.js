let basedbUrl = "https://altscans-api.netlify.app";

document.addEventListener('DOMContentLoaded', function() {
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const chapterNo = urlParams.get('chapter') || '73';
  const seriesName = urlParams.get('series') || 'hclw';
  const seriesId = urlParams.get('id') || '78526';

  function formatTitle(title) {
    return title
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  let series = axios.get(`${basedbUrl}/api/admin/getSeries/${seriesId}/${seriesName}/${chapterNo}`, {})
    .then(function (response) {
      console.log(response)
      let header = document.getElementsByClassName('chapter-title');
      let chapterNoHeader = document.getElementById('current-chapter');
      let chapterNameHeader = document.getElementById('current-chapter-name');

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
    });

  console.log(`Series Log:`, series);
});
