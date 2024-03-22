import axios from 'axios'

axios.post("https://api.kpku-cyber.ru/login", {
    login: "aniby",
    password: "12445k"
}, {
    headers: {
        'Content-Type': 'application/json'
    }
}).then(r => {
    console.log(r.data)
}).catch(e => {
    console.log(e.message)
})