import axios from 'axios'

axios.post("http://localhost:21609/login", {
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