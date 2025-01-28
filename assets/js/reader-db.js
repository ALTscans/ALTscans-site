let basedbUrl = "https://altscans-api.netlify.app";

document.addEventListener('DOMContentLoaded', function() {
  let series = axios.get(`${basedbUrl}/api/admin/getSeries/31868/hclw/73`, {})
    .then(function (response) {
      let imageContainer = document.getElementById('chapter-content');
      if (!imageContainer) {
        // If the container doesn't exist, create it
        imageContainer = document.createElement('div');
        imageContainer.id = 'chapter-content';
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
