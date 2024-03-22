import jwt from 'jsonwebtoken'

export let acsUsers = []

export class ACSUser {
    constructor(id, login) {
        this.id = id;
        this.login = login;

        acsUsers.push(this)
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
            token: this.generateToken()
        }
    }
}