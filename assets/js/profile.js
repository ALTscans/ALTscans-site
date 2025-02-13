async function loadProfile(){
  let response = await axios.get('http://localhost:8888', {});
}

document.addEventListener('DOMContentLoaded', loadProfile());