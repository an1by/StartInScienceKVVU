import {Header, NeedLogin} from "../components/AllPages";
import useAuth from "../authentication/useAuth";
import axios from "axios";
import React, {useState, useEffect, useRef} from 'react';

function constructReport(id, label, text, status) {
    let classes = "";
    switch (status) {
        case "accepted":
            classes = "border-solid border-kvvu-green hover:border-kvvu-green-2 border-4"
            break
        case "declined":
            classes = "border-solid border-red-600 border-4"
            break
        case "wait":
            break
    }
    return <a key={id} href={`/report/${id}`}
              className={"bg-kvvu-gray my-2 p-3 font-inter rounded-3xl h-36 w-3/6 drop-shadow-[0_0px_20px_rgba(0,0,0,0.25)] hover:bg-kvvu-gray-2 ease-in-out duration-200 " + classes}>
        <div className={"flex items-center justify-between"}>
            <div>
                <p className={"font-bold"}>{label}</p>
                <p>{text}</p>
            </div>
            <div className={"bg-kvvu-green h-full w-4"}>
            </div>
        </div>
    </a>
}

async function getReports() {
    let reports = []

    const result = await axios.get("http://localhost:21601/reports/getReports", {withCredentials: true});
    const reportsData = result.data.reports;
    reportsData.forEach(report => {
        const label = `Репорт #${report.id} (${report.login})`;
        const text = report.text;
        const status = report.status;
        reports.push(constructReport(report.id, label, text, status));
    });
    return reports;
}

export default function Panel() {
    const [reportsInPanel, setReportsInPanel] = useState([]);

    const {isAuthenticated, getUser} = useAuth();

    const count = useRef(null);
    useEffect(() => {
        if(count.current == null){
            const fetchData = async () => {
                setReportsInPanel(await getReports())
            }
            fetchData().catch(e => console.log(e));
        }
        return () => { count.current = 1; }
    }, []);

    const cadetPanel = () => {
        return (<div id={"report_list"} className={"items-center w-full flex flex-col indent-4"}>
            <a href={"/createReport"}
               className={"bg-kvvu-green my-2 p-3 font-inter rounded-3xl h-12 w-3/6 drop-shadow-[0_0px_20px_rgba(0,0,0,0.25)] hover:bg-kvvu-green-2 ease-in-out duration-200 "}>
                <p className={"text-center font-bold"}>
                    Создать отчет
                </p>
            </a>
            {reportsInPanel}
        </div>)
    }

    const teacherPanel = () => {
        return (<div id={"report_list"} className={"items-center w-full flex flex-col indent-4"}>
            {reportsInPanel}
        </div>)
    }

    return (isAuthenticated() ? <>
            {Header()}
            {getUser().status === "cadet" ? cadetPanel() : teacherPanel()}
        </> : NeedLogin()
    )
}