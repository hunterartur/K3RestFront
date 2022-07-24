const urlLogin = 'http://localhost:8088/api/auth/login';
var accessToken;
var refreshToken;

const form = document.getElementById('formLogin');
form.addEventListener('submit', sendOnServer);
async function sendOnServer(e) {
    e.preventDefault();
    let login = document.getElementById('inputEmail');
    let password = document.getElementById('inputPassword');
    let authRequest = 
    {
        "login": login.value, 
        "password": password.value
    }

    let response = await fetch(urlLogin, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(authRequest)
    })
    
    let result = await response.json();
    if (response.status === 200) {
        accessToken = result.accessToken;
        refreshToken = result.refreshToken;
        console.log('from login.js' + accessToken);
        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.open("get", "body.html", true);
        oReq.send();
    }

}

function reqListener () {
    let ex = document.getElementById('ex');
    ex.innerHTML = this.responseText;
}