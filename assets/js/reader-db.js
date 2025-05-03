let basedbUrl = base_url;

document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const chapterNo = urlParams.get('chapter');
  const seriesName = urlParams.get('series');
  const seriesId = urlParams.get('id');

  function formatTitle(title) {
    return title
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  if (!chapterNo || !seriesName || !seriesId) {
    console.log(`Error: Missing URL parameters`);

    let header = document.querySelector('.chapter-title');
    if (header) {
      header.textContent = 'Error: Missing URL parameters';
    }
    return;
  }

  async function loadImagesFromCache(seriesId, chapterNo) {
    if ('caches' in window) {
      const cache = await caches.open('image-cache');
      const cachedRequests = await cache.keys();
      const chapterImages = cachedRequests
        .filter((request) => request.url.includes(`/file/seriesImages/${seriesId}/${chapterNo}/`))
        .map((request) => request.url);

      return chapterImages.length > 0 ? chapterImages : null;
    }
    return null;
  }

  async function cacheImages(images) {
    if ('caches' in window) {
      const cache = await caches.open('image-cache');
      for (const imageUrl of images) {
        const response = await fetch(imageUrl);
        await cache.put(imageUrl, response.clone());
        console.log(`Cached image: ${imageUrl}`);
      }
    }
  }

  async function loadChapterImages() {
    // Check if images are already cached
    const cachedImages = await loadImagesFromCache(seriesId, chapterNo);
    if (cachedImages) {
      console.log('Loading images from cache:', cachedImages);
      displayImages(cachedImages);
      return;
    }

    // If not cached, fetch from API
    axios
      .get(`${basedbUrl}/api/admin/getSeries/${seriesId}/${seriesName}/${chapterNo}`, {})
      .then(async function (response) {
        const rawImages = response.data.resources.split('?')[0];
        const filteredImages = rawImages.filter((img) => !img.endsWith('.bzEmpty'));

        // Convert URLs to the proper format and sort them
        const sortedImages = filteredImages
          .map((imageUrl) => imageUrl.split('?')[0]) // Remove query parameters
          .sort((a, b) => {
            const matchA = a.match(/\/(\d+)\.png$/);
            const matchB = b.match(/\/(\d+)\.png$/);
            if (!matchA || !matchB) {
              console.log(`Failed to match URL pattern: ${!matchA ? a : b}`);
              return 0;
            }
            const pageA = parseInt(matchA[1], 10);
            const pageB = parseInt(matchB[1], 10);
            return pageA - pageB;
          });

        console.log('Fetched and sorted images:', sortedImages);

        // Cache the images
        await cacheImages(sortedImages);

        // Display the images
        displayImages(sortedImages);
      })
      .catch(function (error) {
        console.log(`Error: `, error.response);
        let errorRes = error.response.data;
        if (errorRes) {
          let header = document.querySelector('.chapter-title');
          if (header) {
            if (errorRes.error === 'No chapter images found') {
              header.textContent = `Chapter ${chapterNo} Not Found`;
            }
          }
        }
      });
  }

  function displayImages(images) {
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

    // Generate HTML for the images
    const imagesHTML = images
      .map((imageUrl, index) => {
        return `<img src="${imageUrl}" alt="Chapter ${chapterNo} Page ${index + 1}" class="chapter-image">`;
      })
      .join('');

    imageContainer.innerHTML = imagesHTML;
  }

  loadChapterImages();

  var disqus_config = function () {
    this.page.url = window.location.href; // Use current page URL
    this.page.identifier = `${seriesName}-chapter-${chapterNo}`; // Create unique identifier based on series and chapter
  };

  (function () {
    // DON'T EDIT BELOW THIS LINE
    var d = document,
      s = d.createElement('script');
    s.src = 'https://altscan.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
  })();
});
