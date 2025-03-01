const cookie = document.cookie;

const token = cookie.split(';').find(row => row.trim().startsWith('token='));
const userId = cookie.split(';').find(row => row.trim().startsWith('userId='));

if (token && userId) {
    const tokenValue = token.split('=')[1];
    const userIdValue = userId.split('=')[1];

    async function loadProfile() {
      function formatText(text) {
        if (!title) return ""; // Add null check
        return title
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }
      
        try {
            let response = await axios.get('https://altscans-api.netlify.app/api/user/' + userIdValue, {
                headers: {
                    Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiQyF5YjlWY0hjQm5HcWpCRVlQdzhqTnNhQG5RI3V3IiwiaWF0IjoxNzQwODEyOTE1fQ.wImh8Y-s3jZtdEIyTvl9eUEh2VgG_NcjoqX-nlW1Zso`
                }
            });
            
            const username = document.querySelector('.profile-username');
            const profileId = document.querySelector('.profile-id');
            const bio = document.querySelector('.profile-bio');
            
            username.textContent = response.data.username;
            profileId.textContent = `ID: ${userIdValue}`;
            bio.value = response.data.bio || "";
            
            
        } catch (error) {
            console.error(error);
        }
    }

    document.addEventListener('DOMContentLoaded', loadProfile);
} else {
    console.error('Token or userId not found in cookies');
    window.location.href = '/login.html';
}
