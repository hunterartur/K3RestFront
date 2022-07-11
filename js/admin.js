let userUrl = 'http://localhost:8088/api/admin/users/';
let roleUrl = 'http://localhost:8088/api/admin/role/';
let roles = [];
let csrfToken;

async function ready() {
    csrfToken = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, '$1');
    console.log(csrfToken);
    let response = await fetch(roleUrl);
    let result = await response.json();
    let select = document.getElementById('roleSelectUser');
    for(let i=0; i < result.length; i++) {
      let opt = document.createElement('option');
      opt.value = result[i].name;
      opt.innerHTML = result[i].name;
      roles.push(new Role(result[i].id, result[i].name));
      select.appendChild(opt);
    }

    response = await fetch(departmentUrl);
    result = await response.json();
    select = document.getElementById('departmentSelectUSer');
    for(let i=0; i < result.length; i++) {
      let opt = document.createElement('option');
      opt.value = result[i].name;
      opt.innerHTML = result[i].name;
      departments.push(new Department(result[i].id, result[i].name, result[i].director, result[i].employees));
      select.appendChild(opt);
    }

    response = await fetch(userUrl);
    result = await response.json();
    select = document.getElementById('director');
    for(let i=0; i < result.length; i++) {
      let opt = document.createElement('option');
      opt.value = result[i].id;
      opt.innerHTML = result[i].name;
      employees.push(new EmployeeEntity(result[i].id, result[i].firstName, result[i].lastName, result[i].patronymic,
        result[i].post,result[i].department,result[i].assignmentsAuthor,result[i].assignmentsExecutor,result[i].email,
        null,result[i].roles,result[i].locked,result[i].expired,result[i].enabled));
      select.appendChild(opt);
    }
}

document.addEventListener("DOMContentLoaded", ready);

function fillSelectUser(obj, idElem) {
    document.querySelectorAll('#' + idElem + ' option').forEach(option => option.remove());
    let select = document.getElementById(idElem);
    for(let i=0; i < obj.length; i++) {
      let opt = document.createElement('option');
      opt.value = obj[i].name;
      opt.innerHTML = obj[i].name;
      select.appendChild(opt);
    }
}

document.querySelector("#createUser").onclick = function(){
  fillSelectUser(departments, 'departmentSelectUSer');
  fillSelectUser(roles, 'roleSelectUser');
}

const form = document.getElementById('createUserForm');

async function sendFormOnServer(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const values = Object.fromEntries(formData.entries());
  let depart;
  for (let i = 0; i < departments.length; i++) {
      if (values.departmentSelectUSer == departments[i].name) {
        depart = departments[i];
      }
  }
  let role =[];
  for (let i = 0; i < roles.length; i++) {
      if (values.roleSelectUser == roles[i].name) {
        role.push(roles[i]);
      }
  }
  let userEnt = new EmployeeEntity(values.firstName,values.lastName,values.patronymic,values.post,depart
        ,null,null,values.email,values.password,role,false,true,true);
  
        console.log('user: ', userEnt);

  let response = await fetch('http://localhost:8088/api/admin/employee/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(userEnt)
    });

    let result = await response.json();
    
    let myHeaders  = response.headers;
    console.log('Headers: ');
    for (let i = 0; i < myHeaders.length; i++) {
      console.log(myHeaders[i]);
    }
    console.log('HttpStatus' + response.status);
}
 
form.addEventListener('submit', sendFormOnServer);



document.querySelector(".close").onclick = function(){
  document.querySelectorAll('#roleSelectUser option').forEach(option => option.remove());
  document.querySelectorAll('#departmentSelectUSer option').forEach(option => option.remove());
}

document.querySelector(".btnClose").onclick = function(){
  document.querySelectorAll('#roleSelectUser option').forEach(option => option.remove());
  document.querySelectorAll('#departmentSelectUSer option').forEach(option => option.remove());
}

class EmployeeEntity {
  constructor(firstName,lastName,patronymic,post,department
      ,assignmentsAuthor,assignmentsExecutor,email,password,roles,locked,expired,enabled) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.patronymic = patronymic;
      this.post = post;
      this.department = department;
      this.assignmentsAuthor = assignmentsAuthor;
      this.assignmentsExecutor = assignmentsExecutor;
      this.email = email;
      this.password = password;
      this.roles = roles;
      this.locked = locked;
      this.expired = expired;
      this.enabled = enabled;
  }
}

class Role {
  constructor(id, name) {
      this.id= id;
      this.name = name;
  }
}


// class Organization {
//   constructor(id,name,physicalAddress,legalAddress,director,departments) {
//       this.id = id;
//       this.name = name;
//       this.physicalAddress = physicalAddress;
//       this.legalAddress = legalAddress;
//       this.director = director;
//       this.departments = departments;
//   }
// }

class Department {
  constructor(id,name,director,employees) {
      this.id = id;
      this.name = name;
      this.director = director;
      this.employees = employees;
  }
}

// class Assignment {
//   constructor(id,subject,author,executor,datePerformance
//       ,isControl,isExecution,content,state,documents) {
//       this.id = id;
//       this.subject = subject;
//       this.author = author;
//       this.executor = executor;
//       this.datePerformance = datePerformance;
//       this.isControl = isControl;
//       this.isExecution = isExecution;
//       this.content = content;
//       this.state = state;
//       this.documents = documents;
//   }
// }

// class document {
//   constructor(id,title,content) {
//       this.id = id;
//       this.title = title;
//       this.content = content;
//   }
// }