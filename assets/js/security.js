const cookie = document.cookie;

const token = cookie.split(';').find(row => row.trim().startsWith('token='));
const userId = cookie.split(';').find(row => row.trim().startsWith('userId='));

if (token && userId) {
    window.location.href = '/routes/profile.html';
}

const loginForm = document.querySelector('.loginForm');

document.querySelector('.alert-container').style.display = 'none';
document.querySelector('.alert-container-login').style.display = 'none';

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get User Information
    const email = loginForm['login-emailField'].value;
    const pwd = loginForm['login-passwordField'].value;
    
    // Login User
    axios.post('https://altscans-api.netlify.app/api/auth/login', {
        email: email,
        password: pwd
    },
    {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiQyF5YjlWY0hjQm5HcWpCRVlQdzhqTnNhQG5RI3V3IiwiaWF0IjoxNzQwODEyOTE1fQ.wImh8Y-s3jZtdEIyTvl9eUEh2VgG_NcjoqX-nlW1Zso`
        },
    }).then(function (response) {
        try {
            document.cookie = `token=${response.data.token}; path=/`;
            document.cookie = `userId=${response.data.userInfo.id}; path=/`;
            console.log(`Cookie Created for user ${response.data.userInfo.name}: ${response.data.userInfo.id}`);
            // Redirect to profile.html
            window.location.href = '/routes/profile.html';
        } catch (error) {
            console.error('Error setting cookies:', error);
            showAlert(error, 'login');
        }
    }).catch(function (error) {
        showAlert(error, 'login');
    });
});

const signupForm = document.querySelector('.signupForm');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get User Information
    const username = signupForm['signup-usernameField'].value;
    const email = signupForm['signup-emailField'].value;
    const pwd = signupForm['signup-pwdField'].value;
    
    //Send User Info
    
    axios.post('https://altscans-api.netlify.app/api/user/createUser', {
        username: username,
        email: email,
        password: pwd,
        type: 'emailAndPasswordAuth'
    },
    {
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(function (response) {
        console.log(response);
        showAlert(response, 'signup');
    })
    .catch(function (error) {
        console.error('Error signing up:', error);
        showAlert(error, 'signup');
    });
});

function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);

    axios.post('http://localhost:3000/oauth/google', {
        response
    },
    {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': '019417e6-a468-7c95-9e8e-2562e1b182a7'
        },
    });
}

function showDialog() {
    document.getElementById('dialogOverlay').classList.add('active');
    document.getElementById('forgotPwdDialog').classList.add('active');
}

function closeDialog() {
    document.getElementById('dialogOverlay').classList.remove('active');
    document.getElementById('forgotPwdDialog').classList.remove('active');
}

function handleSocialAuth(provider) {
    console.log(provider);

    try {
        switch(provider) {
            case 'google':
                window.location.href = 'https://altscans-api.netlify.app/api/auth/google';
        }
    } catch(error) {
        console.log(error);
    }
}

document.getElementById('verifyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    closeDialog();
});

document.getElementById('dialogOverlay').addEventListener('click', closeDialog);

async function showAlert(response, form) {
    try {
        if (form === 'signup') {
            const alert = document.querySelector('.alert-container');
            if (response.status === 200) {
                console.log("User Created Successfully")
                alert.innerHTML = 'Your account has been created. You can now log in.'
                alert.style.display = 'block';
                alert.style.color = 'green';
            } else {
                alert.innerHTML = 'An error occurred while creating your account.'
                alert.style.display = 'block';
                alert.style.color = 'red';
            }
        } else if (form === 'login') {
            const alert = document.querySelector('.alert-container-login');
            if (response.response && response.response.status === 401) {
                alert.innerHTML = 'Incorrect email or password.'
            } else {
                alert.innerHTML = 'An error occurred while logging in.'
            }
            alert.style.display = 'block';
            alert.style.color = 'red';
        }
    } catch (error) {
        console.log(error);
    }
}
