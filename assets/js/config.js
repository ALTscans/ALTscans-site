//Final Commit For Month - February 2025: Commit bbca616
const base_url = `https://altscans-api.netlify.app`;
const frontoken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiQyF5YjlWY0hjQm5HcWpCRVlQdzhqTnNhQG5RI3V3IiwiaWF0IjoxNzQwODEyOTE1fQ.wImh8Y-s3jZtdEIyTvl9eUEh2VgG_NcjoqX-nlW1Zso`

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