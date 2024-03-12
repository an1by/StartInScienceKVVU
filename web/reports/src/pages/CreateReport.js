import {Header, NeedLogin} from "../components/AllPages";
import useAuth from "../authentication/useAuth";
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function CreateReport() {
    const {isAuthenticated, getUser} = useAuth();

    const [text, setText] = useState("");
    const navigate = useNavigate();

    const createReport = () => {
        axios.post("http://localhost:21601/reports/createReport", {
            text: text
        }, {withCredentials: true}).then(r => {
            alert(JSON.stringify(r.data));
            navigate("/panel", {replace: true})
        }).catch(e => {
            alert("error!");
            console.log(e.message);
        });
    }

    const reportPanel = () => {
        return (<div className={"flex justify-center h-screen w-full"}>
            <div id={"authorization"}
                 className={"justify-center grid grid-cols-1 bg-kvvu-gray rounded-2xl h-3/4 w-2/3 p-4 drop-shadow-[0_0px_20px_rgba(0,0,0,0.25)]"}>
                <p className={"text-left font-bold text-xl py-1.5"}>Оформление отчета</p>
                <input type="text" name="login" id="login"
                       className="rounded-3xl w-full h-96 pl-7 text-gray-100 bg-kvvu-gray shadow-[inset_0_0px_10px_rgba(0,0,0,0.25)] placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mx-auto"
                       placeholder="Мой отчёт..."
                       onChange={(e) => setText(e.target.value)}/>
                <a href="#"
                   className="rounded-3xl bg-kvvu-green shadow-[0_0px_10px_rgba(55,201,61,0.5)] px-3.5 py-2.5 w-1/2 h-10 text-sm text-center font-semibold mx-auto"
                onClick={() => createReport()}>Отправить</a>
            </div>
        </div>)
    }

    return (isAuthenticated() ? <>
        {Header()}
        {reportPanel()}
    </> : NeedLogin())
}