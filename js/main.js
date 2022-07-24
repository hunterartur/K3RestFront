let userUrl = 'http://localhost:8088/api/admin/users/';
let userInfoUrl = 'http://localhost:8088/user/info';
let roleUrl = 'http://localhost:8088/api/admin/roles/';
let roles = [];
let elems;
const MODAL_FORM = document.getElementById('modalViewUpdate');
const urlLogin = 'http://localhost:8088/api/auth/login';
const urlRefresh = 'http://localhost:8088/api/auth/token';
let accessToken;
let refreshToken;

function reqListener () {
    let ex = document.getElementById('ex');
    ex.innerHTML = this.responseText;
}


const form = document.getElementById('createUser');
form.addEventListener('submit', sendFormOnServer);
async function sendFormOnServer(event) {
    event.preventDefault();
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());
    let role =[];
    for (let i = 0; i < roles.length; i++) {
        if (values.createRoles == roles[i].name) {
          role.push(roles[i]);
        }
    }
    let enabled = (values.enabled === 'on');
    let locked = (values.locked === 'on');
    let expired = (values.expired === 'on');
    let user = new User(values.id,values.firstName,values.lastName,values.age,values.email,role, values.password, enabled,locked,expired);
    console.log(user);
    let response = await fetch(userUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify(user)
    });
    result = await response.json();
    let tableListUsers = document.getElementById('listUsers');
    let str = document.createElement('tr');
    str.innerHTML = '<tr>' +
    '<td>' + result.id + '</td>' +
    '<td>' + result.name + '</td>' +
    '<td>' + result.surname + '</td>' +
    '<td>' + result.age + '</td>' +
    '<td>' + result.email + '</td>' +
    '<td><div><input type="button" id="' + result.id + '" onclick="editModalForm(this)" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalViewUpdate" value="Edit"></div></td>' +
    '<td><div><input type="button" id="' + result.id + '" onclick="editModalForm(this)" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#modalViewUpdate" value="Delete"></div></td>' +
    '</tr>';
    tableListUsers.append(str);

    form.reset();

    let tabDisableNav = document.querySelector('#nav-profile-tab');
    tabDisableNav.setAttribute('class', 'nav-link');
    tabDisableNav.setAttribute('aria-selected', 'false');
    let tabDisableDiv = document.querySelector('#nav-profile');
    tabDisableDiv.setAttribute('class', 'tab-pane fade');

    let tabActiveNav = document.querySelector('#nav-home-tab');
    tabActiveNav.setAttribute('class', 'nav-link active');
    tabActiveNav.setAttribute('aria-selected', 'true');
    let tabActiveDiv = document.querySelector('#nav-home');
    tabActiveDiv.setAttribute('class', 'tab-pane fade active show');
}

async function sendFormOnServerUpdate(event) {
    event.preventDefault();
    let id = document.querySelector('#mId');
    let name = document.querySelector('#mName');
    let surname = document.querySelector('#mSurname');
    let age = document.querySelector('#mAge');
    let email = document.querySelector('#mEmail');
    let mRoles = document.querySelector('#mRoles');
    let role =[];
    for (let i = 0; i < roles.length; i++) {
        if (mRoles.value == roles[i].name) {
          role.push(roles[i]);
        }
    }
    let user = new UserDto(id.value,name.value,surname.value,age.value,email.value,role);
    let response = await fetch(userUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify(user)
    });
    if (response.status != 200) {
        accessToken = refreshTkn();
        response = await fetch(userUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + accessToken
            },
            body: JSON.stringify(user)
        });
        if (response.status != 200) {
            window.location.reload()
        }
    }
    if (response.status === 200) {
        let result = await response.json();
        elems[0].innerHTML = result.id;
        elems[1].innerHTML = result.name;
        elems[2].innerHTML = result.surname;
        elems[3].innerHTML = result.age;
        elems[4].innerHTML = result.email;
    }
    $('#modalViewUpdate').modal('hide');
}

//удаление записи
async function sendFormOnServerDelete(event) {
    event.preventDefault();
    let id = document.querySelector('#mId');
    let response = await fetch(userUrl + id.value, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + accessToken
        }
    });
    if (response.status != 200) {
        accessToken = refreshTkn();
        response = await fetch(userUrl + id.value, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + accessToken
            }
        });
        if (response.status != 200) {
            window.location.reload()
        }
    }
    if (response.status === 200) {
        elems[0].parentElement.innerHTML = '';
    }
    $('#modalViewUpdate').modal('hide');
}

//Логин и действия при успешном логине
const formLogin = document.getElementById('formLogin');
formLogin.addEventListener('submit', logonServer);
async function logonServer(e) {
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

    if (response.status === 200) {
        let result = await response.json();
        accessToken = result.accessToken;
        refreshToken = result.refreshToken;
        ready();
    }

}

async function ready() {
    let authModalForm = document.getElementById('authModalForm');
    authModalForm.setAttribute('class', 'modal fade');
    authModalForm.setAttribute('aria-hidden', 'true');
    authModalForm.setAttribute('style', 'display: none;');
    authModalForm.removeAttribute('role');
    authModalForm.removeAttribute('aria-modal');

    let response = await fetch(userInfoUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': 'Bearer ' + accessToken
        }
    });

    console.log(response);
    let result = await response.json();
    let infoUser = document.getElementById('infoTableUser');
    let info = document.createElement('tr');    
    let rolesUser = '';
    for(let i = 0; i < result.roles.length; i++) {
        rolesUser += result.roles[i].name + ' ';
    }
    info.innerHTML = '<tr>' +
    '<td>' + result.id + '</td>' +
    '<td>' + result.name + '</td>' +
    '<td>' + result.surname + '</td>' +
    '<td>' + result.age + '</td>' +
    '<td>' + result.email + '</td>' +
    '<td>' + rolesUser + '</td>' +
    '</tr>';
    infoUser.append(info);
    let headerInfoUser = document.getElementById('headerInfoUser');
    headerInfoUser.innerHTML = ' <span>'+result.email+'</span> with roles: <span>'+rolesUser+'</span>';

    // 

    let wrapper = document.getElementById('wrapper');
    wrapper.removeAttribute('aria-hidden');
    wrapper.removeAttribute('style');
    if (rolesUser.includes('ADMIN')) {
        response = await fetch(userUrl, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + accessToken
            }
        });
        result = await response.json();
        let tableListUsers = document.getElementById('listUsers');

        for(let i = 0; i < result.length; i++) {
            let str = document.createElement('tr');
        
            str.innerHTML = '<tr>' +
            '<td>' + result[i].id + '</td>' +
            '<td>' + result[i].name + '</td>' +
            '<td>' + result[i].surname + '</td>' +
            '<td>' + result[i].age + '</td>' +
            '<td>' + result[i].email + '</td>' +
            '<td><div><input type="button" id="' + result[i].id + '" onclick="editModalForm(this)" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalViewUpdate" value="Edit"></div></td>' +
            '<td><div><input type="button" id="' + result[i].id + '" onclick="editModalForm(this)" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#modalViewUpdate" value="Delete"></div></td>' +
            '</tr>';

            tableListUsers.append(str);
        }

        response = await fetch(roleUrl, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + accessToken
            }
        });
        result = await response.json();
        let sel = document.getElementById('createRoles');
        for (let i = 0; i < result.length; i++) {
            let opt = document.createElement('option');
            opt.value = result[i].name;
            opt.innerHTML = result[i].name;
            roles.push(new Role(result[i].id, result[i].name));
            sel.appendChild(opt);
        }
        sel[1].selected = true;
    } else {
        document.getElementById('v-pills-home-tab').remove();
        document.getElementById('v-pills-home').remove();
    }
}

function fillSelect(obj, idElem) {
    document.querySelectorAll('#' + idElem + ' option').forEach(option => option.remove());
    let select = document.getElementById(idElem);
    for(let i=0; i < obj.length; i++) {
      let opt = document.createElement('option');
      opt.value = obj[i].name;
      opt.innerHTML = obj[i].name;
      select.appendChild(opt);
    }
}

function editModalForm(btn) {
    //Получаю все ячейки строки tr где находиться кнопка
    elems = btn.parentElement.parentElement.parentElement.childNodes;
    let id = document.querySelector('#mId');
    id.value = elems[0].innerHTML;
    let name = document.querySelector('#mName');
    name.value = elems[1].innerHTML;
    let surname = document.querySelector('#mSurname');
    surname.value = elems[2].innerHTML;
    let age = document.querySelector('#mAge');
    age.value = elems[3].innerHTML;
    let email = document.querySelector('#mEmail');
    email.value = elems[4].innerHTML;
    fillSelect(roles, 'mRoles')

    let modalSubmit = document.querySelector('#modalSubmit');
    if (btn.value == 'Delete') {
        document.getElementById('exampleModalLabel').innerHTML = 'Delete user';
        name.readOnly = true;
        surname.readOnly = true;
        age.readOnly = true;
        email.readOnly = true;
        modalSubmit.value = 'Delete';
        MODAL_FORM.addEventListener('submit', sendFormOnServerDelete);
    } else {
        document.getElementById('exampleModalLabel').innerHTML = 'Update user';
        name.readOnly = false;
        surname.readOnly = false;
        age.readOnly = false;
        email.readOnly = false;
        modalSubmit.value = 'Edit';
        MODAL_FORM.addEventListener('submit', sendFormOnServerUpdate);
    }
}

async function refreshTkn() {
    let refreshRequest = {
        'refreshToken': refreshToken
    }
    let response = await fetch(urlRefresh, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(refreshRequest)
    });
    return response.accessToken;
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};