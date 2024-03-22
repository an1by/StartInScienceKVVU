import jwt from 'jsonwebtoken'

export let users = []

export class User {
    constructor(id, login, name, status) {
        this.id = id;
        this.login = login;
        this.name = name;
        this.status = status;

        users.push(this)
    }

    generateToken() {
        return jwt.sign({
            id: this.id, login: this.login
        }, process.env.JWT_SECRET, {
            algorithm: 'HS256',
            expiresIn: '1h'
        })
    }

    get json() {
        return {
            name: this.name,
            status: this.status,
            token: this.generateToken()
        }
    }
}