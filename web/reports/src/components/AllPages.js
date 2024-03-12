import {useNavigate} from 'react-router-dom';
import useAuth from "../authentication/useAuth";

export function Header() {
    const {signOut, getUser, getStatusName} = useAuth();
    const navigate = useNavigate();

    return <>
        <header
            className="bg-kvvu-gray font-inter rounded-full my-4 h-16 mx-2 drop-shadow-[0_0px_20px_rgba(0,0,0,0.25)]">
            <nav className="flex items-center justify-between p-5 px-8 mx-auto" aria-label="Global">
                <a href={"/panel"}>
                    <p className={"text-left font-bold text-lg"}>Сдача отчетов</p>
                </a>
                <p className={"text-right flex items-center indent-3"}>
                    <a id={"rank"}>{getStatusName()}</a>
                    <a id={"name"} className={"font-bold text-kvvu-green"}>{getUser().name}</a>
                    <a id={"exit"} href={""} onClick={() => {
                        signOut();
                        navigate("/")
                    }}>Выход</a>
                </p>
            </nav>
        </header>
    </>;
}

export function NeedLogin() {
    return (<div className={"flex justify-center items-center h-screen w-full"}>
        <div id={"authorization"}
             className={"justify-center grid grid-cols-1 bg-kvvu-gray rounded-2xl h-18 w-96 p-4 drop-shadow-[0_0px_20px_rgba(0,0,0,0.25)]"}>
            <a href="/"
               className="rounded-3xl bg-kvvu-green shadow-[0_0px_10px_rgba(55,201,61,0.5)] px-3.5 py-2.5 w-1/2 h-10 text-sm text-center font-semibold mx-auto">
                Авторизоваться
            </a>
        </div>
    </div>)
}