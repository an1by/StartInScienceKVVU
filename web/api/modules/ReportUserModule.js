import config from "../config.json" assert {type: 'json'}
import jwt from 'jsonwebtoken'

export let reportUsers = []

export class ReportUser {
    constructor(id, login, name, status) {
        this.id = id;
        this.login = login;
        this.name = name;
        this.status = status;

        reportUsers.push(this)
    }

    generateToken() {
        return jwt.sign({
            id: this.id, login: this.login
        }, config.jwt_secret, {
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