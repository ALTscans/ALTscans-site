document.addEventListener('DOMContentLoaded', () => {
  async function handleDetails() {
    const head = document.querySelector('.head');
    const seriesThumbnail = document.querySelector('image-container');
    let title = document.querySelector('.title');
    
    let nick, seriesId;
    
    // Check if we're using the old or new URL format
    if (window.location.search) {
      // Old format with query parameters
      const urlParams = new URLSearchParams(window.location.search);
      nick = urlParams.get('series');
      seriesId = urlParams.get('id');
    } else {
      // New format with path segments
      const pathSegments = window.location.pathname.split('/');
      nick = pathSegments[2];
      seriesId = pathSegments[3];
    }
    
    function formatTitle(title) {
      return title
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    if (!nick || !seriesId) { 
      console.log(`Error: Missing URL parameters`);
      if (title) {
        title.textContent = 'Error: Missing URL parameters';
      }
      return;
    }
    
    try {
      const response = await axios.get(`https://altscans-api/api/admin/getSeriesDetails/${seriesId}/${nick}`)
        .then(response => response.data.seriesDetails);
      
      console.log(response);
      if (title) {
        title.textContent = formatTitle(response.title);
      }
      
    } catch (error) {
      console.error('Error fetching series details:', error);
    }
  }

  handleDetails();
});