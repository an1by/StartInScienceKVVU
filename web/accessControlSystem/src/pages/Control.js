import {useEffect} from "react";
import {useNavigate} from 'react-router-dom';
import useAuth from "../authentication/useAuth";
import WebSocket from "ws";

export default function Control() {
    const {signOut, getUser, isAuthenticated} = useAuth();

    // Web Socket
    const ws = new WebSocket('ws://api.kpku-cyber.ru:21602', {
        perMessageDeflate: false
    });

    ws.on('open', () => {
        if (isAuthenticated)
            ws.send(`auth|${getUser().socketKey}`)
    });

    ws.on('message', (data) => {
        if (data.startsWith("update_state|")) {
            const split = data.split("|");
            const id = split[1];
            const state = split[2];
            if ("_toggle_" in id) {
                setToggle(id, state)
            }
        }
    });

    // React
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/', {replace: true})
        }
    }, []);


    let switchStatusMap = {}

    function setToggle(id, status) {
        const switchToggle = document.querySelector(`#${id}`);

        if (!(id in switchStatusMap)) {
            switchStatusMap[id] = false;
        }

        let switchStatus = status === "2" ? !switchStatusMap[id] : status === "0";
        switchStatusMap[id] = switchStatus;
        if (switchStatus) {
            switchToggle.classList.remove('bg-kvvu-red', '-translate-x-2')
            switchToggle.classList.add('bg-kvvu-green', 'translate-x-full')
        } else {
            switchToggle.classList.add('bg-kvvu-red', '-translate-x-2')
            switchToggle.classList.remove('bg-kvvu-green', 'translate-x-full')
        }
    }

    function switchToggle(id) {
        setToggle(id, "2")
    }

    const toggle_name = (id, name) => (id === 1 ? "first" : "second") + "_toggle_" + name;

    const barrack = (id) => {
        return <div
            className={"text-center items-center boxblue grid gap-x-0 grid-cols-4 w-[28vw] h-[7.5vw]"}>
            <div className={"text-left ml-2"}>
                <p className={""}>Казарма №{id}</p>
            </div>
            <div className={"mt-[11%] w-[7.2vw]"}>
                <p>Датчики пожара</p>
                <div className={"grid grid-cols-3 place-items-center"}>
                    <div className={"grid grid-cols-1 place-items-center "}>
                        <div className={"reddatbox"}></div>
                        <p className={"text-center"}>1</p>
                    </div>
                    <div className={"grid grid-cols-1 place-items-center "}>
                        <div className={"yellowdatbox"}></div>
                        <p className={"text-center"}>2</p>
                    </div>
                    <div className={"grid grid-cols-1 place-items-center "}>
                        <div className={"greendatbox"}></div>
                        <p className={"text-center"}>3</p>
                    </div>
                </div>
            </div>
            <div className={""}>
                <p className={""}>Отопление</p>
                <button
                    className="w-16 h-8 rounded-lg bg-white transition duration-300 focus:outline-none shadow"
                    onClick={() => {
                        switchToggle(toggle_name(id, "otoplenie"))
                    }}>
                    <div id={toggle_name(id, "otoplenie")}
                         className="w-6 h-6 ml-3 relative rounded-lg -translate-x-2 transition duration-500 transform bg-kvvu-red text-white">
                    </div>
                </button>
            </div>
            <div>
                <p>Вода</p>
                <button
                    className="w-16 h-8 rounded-lg bg-white transition duration-300 focus:outline-none shadow"
                    onClick={() => {
                        switchToggle(toggle_name(id, "water"))
                    }}>
                    <div id={toggle_name(id, "water")}
                         className="w-6 h-6 ml-3 relative rounded-lg -translate-x-2 transition duration-500 transform bg-kvvu-red text-white">
                    </div>
                </button>
            </div>
        </div>
    }

    return (isAuthenticated() ? <div className={"h-screen"}>
        <div className={"flex h-full w-auto"}>
            <div id={"menu"}
                 className={"text-white text-left items-center bg-gradient-to-br from-kvvu-blue to-kvvu-blue-2 ml-4 mr-2 rounded-2xl my-5 w-96 p-4"}>
                <div className={"mx-6"}>
                    <p className={"text-2xl text-center font-bold my-3"}>СКУД 0.9.0</p>
                    <hr className="h-0.5 w-auto mt-5 bg-white border-0"/>
                </div>
                <div className={"my-8 text-lg font-light grid grid-cols-1 place-items-left mx-6 h-64"}>
                    <a>Главная</a>
                    <a>Статистика</a>
                    <a>Отчеты</a>
                    <a>Пользователи</a>
                    <a>Помощь</a>
                </div>
                <a href={"#"} onClick={() => {
                    signOut();
                    navigate("/")
                }}>
                    <p className={"my-[100%] text-lg font-light mx-6"}>Выход</p>
                </a>
            </div>
            <div id={"control_map"}
                 className={"shadow-[inset_0_0px_15px_rgba(0,0,0,0.2)] bg-white ml-2 mr-4 rounded-2xl h-128 my-5 w-full"}>
                <div id={"elements"} className={"font-bold text-xs text-white"}>
                    <div
                        className={"absolute boxblue grid gap-x-0 grid-cols-2 w-[15vw] h-[7.5vw] left-[60%] top-[64%]"}>
                        <div className={"ml-5 mt-11"}>
                            <p className={""}>КПП</p>
                        </div>
                        <div className={"my-3 -ml-10 text-xs grid grid-cols-1 place-items-center h-20 w-36"}>
                            <a href={"#"} className={"shlagbaum font-light"}>Поднять шлагбаум</a>
                            <a href={"#"} className={"shlagbaum font-light"}>Опустить шлагбаум</a>
                        </div>
                    </div>
                    <div className={"absolute boxblue w-[8vw] h-[8vw] left-[42%] top-[44%] flex items-center"}>
                        <p className={"text-center"}>Управление антенной</p>
                    </div>
                    <div className={"absolute boxblue w-[8vw] h-[8vw] left-[42%] top-[19%] flex items-center"}>
                        <p className={"text-center"}>Управление ГСМ</p>
                    </div>
                    <div className={"absolute left-[60%] top-[5%]"}>
                        {barrack(2)}
                    </div>
                    <div className={"absolute left-[60%] top-[33%]"}>
                        {barrack(1)}
                    </div>
                </div>
                <div className={"h-[97%] w-auto"} style={{
                    backgroundImage: `url(/images/road.png)`,
                    backgroundPosition: 'right',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat'
                }}>
                </div>
            </div>
        </div>
    </div> : <div></div>)
}