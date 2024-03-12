import {Header, NeedLogin} from "../components/AllPages";
import useAuth from "../authentication/useAuth";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";

const getReport = async (id) => {
    const result = await axios.get("http://localhost:21601/reports/getReports?id=" + id, {withCredentials: true});
    return result.data.reports[0]
}

export default function CreateReport() {
    const {isAuthenticated, getUser} = useAuth();

    let {id} = useParams();

    const navigate = useNavigate();

    const [reportText, setReportText] = useState("");
    const [reportLabel, setReportLabel] = useState("");
    const [reportStatus, setReportStatus] = useState("");

    const count = useRef(null);
    useEffect(() => {
        if (count.current == null) {
            const fetchData = async () => {
                const report = await getReport(id);
                const label = `Репорт #${report.id} (${report.login})`;
                setReportLabel(label);
                setReportText(report.text);
                setReportStatus(report.status);
            }
            fetchData().catch(e => console.log(e));
        }
        return () => {
            count.current = 1;
        }
    }, []);

    const accept = async () => {
        const result = await axios.post("http://localhost:21601/reports/updateReport", {
            id: id,
            status: "accepted"
        }, {withCredentials: true});
        navigate("/panel", {replace: true})
    }
    const decline = async () => {
        const result = await axios.post("http://localhost:21601/reports/updateReport", {
            id: id,
            status: "declined"
        }, {withCredentials: true});
        navigate("/panel", {replace: true})
    }

    const getButtons = () => {
        if (reportStatus === "wait") {
            return (<div className={"columns-2 justify-center flex"}>
                <a href="#"
                   className="rounded-3xl bg-kvvu-green shadow-[0_0px_10px_rgba(55,201,61,0.5)] px-3.5 py-2.5 w-1/3 h-10 text-sm text-center font-semibold mx-auto"
                   onClick={async (e) => {
                       await accept();
                   }}>Принять</a>
                <a href="#"
                   className="rounded-3xl bg-red-600 shadow-[0_0px_10px_rgba(255,0,0,0.5)] px-3.5 py-2.5 w-1/3 h-10 text-sm text-center font-semibold mx-auto"
                   onClick={async (e) => {
                       await decline();
                   }}>Отклонить</a>
            </div>)
        }
        return <></>
    }

    const reportPanel = () => {
        return (<div className={"flex justify-center h-screen w-full"}>
            <div id={"authorization"}
                 className={"justify-center grid grid-cols-1 bg-kvvu-gray rounded-2xl h-3/4 w-2/3 p-4 drop-shadow-[0_0px_20px_rgba(0,0,0,0.25)]"}>
                <p className={"text-left font-bold text-xl py-1.5"}>{reportLabel}</p>
                <input readOnly={true}
                       type="text" name="login" id="login"
                       className="rounded-3xl w-full h-96 pl-7 text-gray-100 bg-kvvu-gray shadow-[inset_0_0px_10px_rgba(0,0,0,0.25)] placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mx-auto"
                       value={reportText}/>
                {getButtons()}
            </div>
        </div>)
    }

    return (isAuthenticated() ?
        <>
            {Header()}
            {reportPanel()}
        </>
        : NeedLogin())
}