let userUrl = 'http://localhost:8088/api/admin/users/';
let roleUrl = 'http://localhost:8088/api/admin/roles/';
let roles = [];
let elems;

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
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
    });
}


const formUpdate = document.getElementById('modalViewUpdate');
formUpdate.addEventListener('submit', sendFormOnServerUpdate);
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
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
    });
    let result = await response.json();
    if (response.status === 200) {
        elems[0].innerHTML = result.id;
        elems[1].innerHTML = result.name;
        elems[2].innerHTML = result.surname;
        elems[3].innerHTML = result.age;
        elems[4].innerHTML = result.email;
    }
    console.log(response);
}

async function editModalForm(btn) {
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
    // let elems = btn.parentElement.parentElement.parentElement.childNodes;
    // for (let i = 0; i < elems.length - 2; i++) {
    //     console.log(elems[i].innerHTML);
    // }
}

async function ready() {
    let response = await fetch(userUrl);
    let result = await response.json();
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
        '<td><div><input type="button" id="' + result[i].id + '" onclick="deleteModalForm(this)" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#modalViewDelete" value="Delete"></div></td>' +
        '</tr>';

        tableListUsers.append(str);
    }

    response = await fetch(roleUrl);
    result = await response.json();
    let sel = document.getElementById('createRoles');
    for (let i = 0; i < result.length; i++) {
        let opt = document.createElement('option');
        opt.value = result[i].name;
        opt.innerHTML = result[i].name;
        roles.push(new Role(result[i].id, result[i].name));
        sel.appendChild(opt);
    }
}
document.addEventListener("DOMContentLoaded", ready);

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