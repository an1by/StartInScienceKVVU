import Cookies from 'universal-cookie';
import {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import useAuth from "../authentication/useAuth";
import axios from 'axios'


export default function Login() {
    const {isAuthenticated, signIn} = useAuth();

    const [loginValue, setLoginValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");

    const navigate = useNavigate();
    const cookies = new Cookies(null, { path: '/' });

    const redirectToPanel = () => {
        navigate('/panel', {replace: true})
    }

    useEffect(() => {
        if (isAuthenticated()) {
            redirectToPanel();
        }
    }, []);

    const Login = () => {
        axios.post("http://localhost:21601/reports/login", {
            login: loginValue,
            password: passwordValue
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            const data = response.data;
            if ("token" in data && "name" in data && "status" in data) {
                signIn(data.token, {
                    name: data.name,
                    status: data.status
                });
                redirectToPanel();
            }
        }).catch((e) => {
            alert("Error!");
            console.log(e)
        })
    };


    return (!isAuthenticated() ? <div className={"flex justify-center items-center h-screen w-full"}>
        <div id={"authorization"}
             className={"justify-center grid grid-cols-1 bg-kvvu-gray rounded-2xl h-72 w-96 p-4 drop-shadow-[0_0px_20px_rgba(0,0,0,0.25)]"}>
            <p className={"text-center font-bold text-2xl py-1.5"}>Авторизация</p>
            <input type="text" name="login" id="login"
                   className="w-4/5 h-10 rounded-3xl py-1.5 pl-7 text-gray-100 bg-kvvu-gray shadow-[inset_0_0px_10px_rgba(0,0,0,0.25)] placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mx-auto"
                   placeholder="Логин"
                   onChange={(e) => setLoginValue(e.target.value)}/>
            <input type="text" name="password" id="password"
                   className="w-4/5 h-10 rounded-3xl pl-7 text-gray-100 bg-kvvu-gray shadow-[inset_0_0px_10px_rgba(0,0,0,0.25)] placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mx-auto"
                   placeholder="Пароль"
                   onChange={(e) => setPasswordValue(e.target.value)}/>
            <a href="#"
               className="rounded-3xl bg-kvvu-green shadow-[0_0px_10px_rgba(55,201,61,0.5)] px-3.5 py-2.5 w-1/2 h-10 text-sm text-center font-semibold mx-auto"
               onClick={() => Login()}>Войти
            </a>
        </div>
    </div> : <div></div>)
}