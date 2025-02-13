const loginForm = document.querySelector('#loginForm');
console.log(loginForm);
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get User Information
    const email = loginForm['emailField'].value;
    const pwd = loginForm['pwdField'].value;
    console.log(email + `||` + pwd);

    // Login User
    axios.post('http://localhost:3000/signIn', {
      email: email,
      pwd: pwd
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '019417e6-a468-7c95-9e8e-2562e1b182a7'
      },
    }
  ).then(function (response) {
    console.log(response)
  }).catch(function (error) {
    console.log(error);
  });
});

const signupForm = document.querySelector('#signupForm');
console.log(signupForm);
signupForm.addEventListener('submit', (e) => {
    console.log(signupForm)
    e.preventDefault();
        
    //get User Information
    const username = signupForm['signup-usernameField'].value;
    const email = signupForm['signup-emailField'].value;
    const pwd = signupForm['signup-pwdField'].value;
    console.log(signupForm)
    console.log(username + `||` + email + `||` + pwd);

    //Send User Info

    axios.post('http://localhost:3000/createUser', {
        username: username,
        email: email,
        pwd: pwd
      },
      {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': '019417e6-a468-7c95-9e8e-2562e1b182a7'
          },
      }
    )
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
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
  }
);
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