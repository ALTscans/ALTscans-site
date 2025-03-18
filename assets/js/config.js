//Final Commit For Month - February 2025: Commit bbca616
const base_url = `http://localhost:8888`;
const frontoken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiQyF5YjlWY0hjQm5HcWpCRVlQdzhqTnNhQG5RI3V3IiwiaWF0IjoxNzQwODEyOTE1fQ.wImh8Y-s3jZtdEIyTvl9eUEh2VgG_NcjoqX-nlW1Zso`



// Common Functions
function openSeries(manga, nick) {
  window.location.href = `/series/?series=${nick}&id=${manga}`;
}

function formatTitle(title) {
  if (!title) return ""; // Add null check
  return title
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(dateString) {
const date = new Date(dateString);
const day = String(date.getDate()).padStart(2, '0');
const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
const year = date.getFullYear();

return `${day}/${month}/${year}`;
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function truncateDescription(desc, wordLimit) {
  const words = desc.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return desc;
}

function getTokenValue() {
  const cookie = document.cookie;
  const token = cookie.split(';').find(row => row.trim().startsWith('token='));
  return token ? token.split('=')[1] : null;
  
  if(tokenValue === null){
    console.log('No user token found. User not logged in.');
    return null;
  }
}

function getUserIdValue() {
  const cookie = document.cookie;
  const userId = cookie.split(';').find(row => row.trim().startsWith('userId='));
  return userId ? userId.split('=')[1] : null;
  
  if(userIdValue === null){
    console.log('No user id found. User not logged in.');
    return null;
  }
}
