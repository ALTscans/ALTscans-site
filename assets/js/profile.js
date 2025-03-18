// Cookies
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
                    'x-user-token': `${tokenValue}`
                }
            });
            
            const username = document.querySelector('.profile-username');
            const profileId = document.querySelector('.profile-id');
            const bio = document.querySelector('.profile-bio');
            const profileImageContainer = document.querySelector('.profile-image-container');
            const bookmarkList = document.querySelector('.bookmarks-list');
            
            console.log(response.data);
            username.textContent = response.data.username;
            profileId.textContent = `ID: ${userIdValue}`;
            bio.value = response.data.bio || "";
            profileImageContainer.innerHTML = `<img src="${response.data.profilePicture}" alt="Profile Image" class="profile-image" id="profile-image">`;

            let bookmarks = response.data.bookmark || [];
            bookmarkList.innerHTML = ''; // Clear the list before adding new items
            bookmarks.forEach(bookmark => {
              const bookmarkItem = document.createElement('div');
              bookmarkItem.classList.add('bookmark-item');
              bookmarkItem.innerHTML = `
                  <div class="bookmark-image">
                      <img src="${bookmark.thumbnail || ''}" alt="${formatTitle(bookmark.series)} cover">
                  </div>
                  <div class="bookmark-details">
                      <h3 class="bookmark-title">${formatTitle(bookmark.series)}</h3>
                      <div class="bookmark-info">Viewed: <span class="chapter-viewed">${bookmark.lastRead}</span></div>
                      <div class="bookmark-info">Current: <span class="chapter-current">${bookmark.currentChapter || 0}</span></div>
                      <div class="bookmark-info">Last updated: ${formatDate(bookmark.lastUpdated)}</div>
                  </div>
                  <button class="remove-btn remove-bookmark" aria-label="Remove bookmark">Remove</button>
              `;
              bookmarkList.appendChild(bookmarkItem);

              // Attach event listener to the remove button
              bookmarkItem.querySelector('.remove-bookmark').addEventListener('click', () => removeBookmark(bookmark.series));
            });
            
        } catch (error) {
            console.error(error);
        }
    }
    
    async function updateProfile() {
        try {
            const bio = document.querySelector('.profile-bio').value;

            let response = await axios.put(`${base_url}/api/user/${userIdValue}`, {
              type: `user-update`,  
              bio: escapeHtml(bio)
            }, {
                headers: {
                    Authorization: `${frontoken}`,
                    'x-user-token': `${tokenValue}`
                }
            });

            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }
    
    async function removeBookmark(series) {
        try {
            let response = await axios.delete(`${base_url}/api/user/${userIdValue}/bookmarks`, {
                headers: {
                    Authorization: `${frontoken}`,
                    'x-user-token': `${tokenValue}`
                },
                data: {
                    seriesName: series
                }
            });

            console.log(response.data);
            
            if(response.data.message === 'Bookmark removed successfully' && response.status === 200) {
              alert('Bookmark removed successfully');
              // Optionally, reload the profile to reflect the changes
              loadProfile();
            }
            
        } catch (error) {
            console.error(error);
        }
    }
    
    async function logout() {
        try {
          // Delete cookies by setting expiration to past date
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            window.location.href = '/login';
        } catch (error) {
            console.error(error);
        }
    }
    
    document.querySelector('.logout').addEventListener('click', logout);
    document.querySelector('.saveBio').addEventListener('click', updateProfile);
    
    document.addEventListener('DOMContentLoaded', loadProfile);
} else {
    console.error('Token or userId not found in cookies');
    window.location.href = '/login';
}
