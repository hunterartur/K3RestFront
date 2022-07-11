class User {
    constructor(id,name,surname,age,email,roles, password, enabled,locked,expired) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.age = age;
        this.email = email;
        this.enabled = enabled;
        this.locked = locked;
        this.expired = expired;
        this.roles = roles;
        this.password = password;
    }
}

class UserDto {
    constructor(id,name,surname,age,email,roles) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.age = age;
        this.email = email;
        this.roles = roles;
    }
}

class Role {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}