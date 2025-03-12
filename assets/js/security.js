// Function to set a cookie with an expiration time
function setCookie(name, value) {
    document.cookie = `${name}=${value}; path=/`;
}

const cookie = document.cookie;

const token = cookie.split(';').find(row => row.trim().startsWith('token='));
const userId = cookie.split(';').find(row => row.trim().startsWith('userId='));

if (token && userId) {
    window.location.href = '/routes/profile.html';
}

const loginForm = document.querySelector('.loginForm');

document.querySelector('.alert-container').style.display = 'none';
document.querySelector('.alert-container-login').style.display = 'none';

// Add event listeners to the login type buttons
const nonAnonymousLoginButton = document.getElementById('nonAnonymousLogin');
const anonymousLoginButton = document.getElementById('anonymousLogin');
const usernameField = document.getElementById('login-usernameField');
const emailField = document.getElementById('login-emailField');

usernameField.style.display = 'none';
    
nonAnonymousLoginButton.addEventListener('click', () => {
    usernameField.style.display = 'none';
    emailField.style.display = 'block';
    emailField.setAttribute('required', 'required');
    usernameField.removeAttribute('required');
});

anonymousLoginButton.addEventListener('click', () => {
    emailField.style.display = 'none';
    usernameField.style.display = 'block';
    usernameField.setAttribute('required', 'required');
    emailField.removeAttribute('required');
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get User Information
    const username = loginForm['login-usernameField'].value;
    const email = loginForm['login-emailField'].value;
    const pwd = loginForm['login-passwordField'].value;

    if (usernameField.style.display === 'block') {
        // Login User with username
        axios.post(`${base_url}/api/auth/login`, {
            username: username,
            password: pwd
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${frontoken}`
            },
        }).then(function (response) {
            try {
                // Set cookies
                setCookie('token', response.data.token);
                setCookie('userId', response.data.userInfo.id);
                console.log(`Cookie Created for user ${response.data.userInfo.name}: ${response.data.userInfo.id}`);
                
                //Redirect to profile.html
                setTimeout(() => {
                    window.location.href = '/routes/profile.html';
                }, 5000);
                
            } catch (error) {
                console.error('Error setting cookies:', error);
                showAlert(error, 'login');
            }
        }).catch(function (error) {
            showAlert(error, 'login');
            console.log(error);
        });
    } else {
        // Login User with email
        axios.post(`${base_url}/api/auth/login`, {
            email: email,
            password: pwd
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${frontoken}`
            },
        }).then(function (response) {
            try {
                // Set cookies
                setCookie('token', response.data.token);
                setCookie('userId', response.data.userInfo.id);
                console.log(`Cookie Created for user ${response.data.userInfo.name}: ${response.data.userInfo.id}`);
                
                //Redirect to profile.html
                setTimeout(() => {
                    window.location.href = '/routes/profile.html';
                }, 5000);
                
            } catch (error) {
                console.error('Error setting cookies:', error);
                showAlert(error, 'login');
            }
        }).catch(function (error) {
            showAlert(error, 'login');
            console.log(error);
        });
    }
});

const signupForm = document.querySelector('.signupForm');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get User Information
    const username = signupForm['signup-usernameField'].value;
    const email = signupForm['signup-emailField'].value;
    const pwd = signupForm['signup-pwdField'].value;
    const confirmPwd = signupForm['signup-confirmPwdField'].value;

    if (pwd !== confirmPwd) {
        showAlert('Passwords do not match', 'signup', 'Passwords do not match');
        return;
    }

    // Send User Info
    axios.post(`${base_url}/api/user/createUser`, {
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
        showAlert(error.message, 'signup', error.message);
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

function showDialog(dialogId) {
    document.getElementById('dialogOverlay').classList.add('active');
    document.getElementById(dialogId).classList.add('active');
}

function closeDialog() {
    document.getElementById('dialogOverlay').classList.remove('active');
    document.querySelectorAll('.forgot-pwd-dialog, .anonymous-user-info').forEach(dialog => {
        dialog.classList.remove('active');
    });
}

async function handleSocialAuth(provider) {
    console.log(provider);

    try {
        switch(provider) {
            case 'google':
                window.location.href = `${base_url}/api/auth/google`;
                break;
            
            case 'anonymous':
                let user = await axios.post(`${base_url}/api/user/anonymous`);
                
                const anonUserInfoContent = `
                    <p>Anonymous User: ${user.data.username}</p>
                    <p>Password: ${user.data.password}</p>
                `;
                
                document.getElementById('anonUserInfoContent').innerHTML = anonUserInfoContent;
                showDialog('anonUserInfo');
                console.log(user);
                break;
            
            default:
                throw new Error('Invalid provider');
        }
    } catch(error) {
        console.error(error);
    }
}

document.getElementById('verifyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    closeDialog();
});

document.getElementById('dialogOverlay').addEventListener('click', closeDialog);

async function showAlert(response, form, err) {
    try {
        if (form === 'signup') {
            const alert = document.querySelector('.alert-container');
            if (response.status === 200) {
                console.log("User Created Successfully")
                alert.innerHTML = 'Your account has been created. You can now log in.'
                alert.style.display = 'block';
                alert.style.color = 'green';
            } else {
                alert.innerHTML = err || 'An error occurred while creating your account.'
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