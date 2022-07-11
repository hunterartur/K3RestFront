let userUrl = 'http://localhost:8088/api/admin/users/';
let roleUrl = 'http://localhost:8088/api/admin/roles/';
let roles = [];
let csrfToken;

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


const form_update = document.getElementById('modalViewUpdate');
form_update.addEventListener('submit', sendFormOnServerUpdate);
async function sendFormOnServerUpdate(event) {
    event.preventDefault();
    const formData = new FormData(form_update);
    const values = Object.fromEntries(formData.entries());
    let role =[];
    for (let i = 0; i < roles.length; i++) {
        if (values.createRoles == roles[i].name) {
          role.push(roles[i]);
        }
    }
    let user = new UserDto(values.id,values.firstName,values.lastName,values.age,values.email,role);
    console.log(user);
    let response = await fetch(userUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
    });
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
        '<td><div><button type="button" id="' + result[i].id + result[i].name + '" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalViewUpdate">Edit</button></div></td>' +
        '<td><div><button type="button" id="' + result[i].id + result[i].name + '" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#modalViewDelete">Delete</button></div></td>' +
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