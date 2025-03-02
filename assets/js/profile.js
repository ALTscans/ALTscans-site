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
            let response = await axios.get(`${base_url}/api/user/${userIdValue}`, {
                headers: {
                    Authorization: `${frontoken}`,
                    Token: `${tokenValue}`
                }
            });
            
            const username = document.querySelector('.profile-username');
            const profileId = document.querySelector('.profile-id');
            const bio = document.querySelector('.profile-bio');
            const profileImageContainer = document.querySelector('.profile-image-container');
            console.log(response.data);
            username.textContent = response.data.username;
            profileId.textContent = `ID: ${userIdValue}`;
            bio.value = response.data.bio || "";
            profileImageContainer.innerHTML = `<img src="${response.data.profilePicture}" alt="Profile Image" class="profile-image" id="profile-image">`;

            
        } catch (error) {
            console.error(error);
        }
    }
    
    async function updateProfile() {
        try {
            const bio = document.querySelector('.profile-bio').value;

            let response = await axios.put(`${base_url}/api/user/${userIdValue}`, {
              type: `user-update`,  
              bio: bio
            }, {
                headers: {
                    Authorization: `${frontoken}`
                }
            });

            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }
    
    document.querySelector('.saveBio').addEventListener('click', updateProfile);
    document.addEventListener('DOMContentLoaded', loadProfile);
} else {
    console.error('Token or userId not found in cookies');
    window.location.href = '/login';
}
