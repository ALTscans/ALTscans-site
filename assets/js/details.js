document.addEventListener('DOMContentLoaded', () => {
  async function handleDetails() {
    const head = document.querySelector('.head');
    const seriesThumbnail = document.querySelector('image-container');
    let title = document.querySelector('.title');
    
    // Get current URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const nick = urlParams.get('series');
    const seriesId = urlParams.get('id');
    console.log(nick, seriesId)
    
    // Update URL to clean format without page reload
    if (nick && seriesId) {
      const newUrl = `/series/?nick=${nick}&id=${seriesId}`;
      history.pushState({}, '', newUrl);
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
      const response = await axios.get(`http://localhost:8888/api/admin/getSeriesDetails/${seriesId}/${nick}`)
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
  
  // Handle browser back/forward buttons
  window.addEventListener('popstate', handleDetails);
});