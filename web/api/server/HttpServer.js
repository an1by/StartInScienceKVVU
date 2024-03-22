// Database
import Database from "../database/MySQLDatabase.js";

// Users
import jwt from "jsonwebtoken";
async function getReportUserFromToken(encodedToken) {
    try {
        const payload = await jwt.verify(encodedToken, process.env.JWT_SECRET);
        if (payload != null) {
            return await database.getReportUserWithLogin(payload.login);
        }
    } catch (e) {}
    return null;
}

async function getACSUserFromToken(encodedToken) {
    try {
        const payload = await jwt.verify(encodedToken, process.env.JWT_SECRET);
        if (payload != null) {
            return await database.getACSUserWithLogin(payload.login);
        }
    } catch (e) {}
    return null;
}

// Express
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {reports} from "../modules/ReportModule.js";

const database = new Database();
await database.connect();

const app = express();
app.use(cookieParser());
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}));

app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// Express Rest
app.post('/acs/login', async (req, res) => {
    if (req.body != null && "login" in req.body && "password" in req.body) {
        const login = req.body.login,
            password = req.body.password;
        let user = null;
        try {
            user = await database.getACSUser(login, password);
        } catch (e) {
            res.json({"error": "Database error"}).status(400);
            return
        }
        if (user != null) {
            let data = user.json;
            data["socket_key"] = process.env.WEBSOCKET_CLIENT_AUTH_KEY;
            res.json(data)
                .status(200);
            return;
        }
    }
    res.json({"error": "Bad request"}).status(400);
});


// Reports
app.post('/reports/login', async (req, res) => {
    if (req.body != null && "login" in req.body && "password" in req.body) {
        const login = req.body.login,
            password = req.body.password;
        let user = null;
        try {
            user = await database.getReportUser(login, password);
        } catch (e) {
            res.json({"error": "Database error"}).status(400);
            return
        }
        if (user != null) {
            res.json(user.json)
                .status(200);
            return;
        }
    }
    res.json({"error": "Bad request"})
        .status(400);
});

app.post("/reports/updateReport", async (req, res) => {
    let user= null;
    if (req.cookies != null && "reports_auth" in req.cookies) {
        try {
            user = await getReportUserFromToken(req.cookies.reports_auth);
        } catch (e) {
            res.json({"error": "Database error"}).status(400);
            return
        }
    }
    if (user == null) {
        res.status(401).send("Not Authorized")
        return
    }
    if (user.status === "cadet") {
        res.status(403).send("Forbidden")
        return
    }
    if (!("id" in req.body && "status" in req.body)) {
        res.status(400).send("Bad Request")
        return
    }

    let result = false;

    try {
        result = await database.updateReport(parseInt(req.body.id), req.body.status);
    } catch (e) {
        res.json({"error": "Database error"}).status(400);
        return
    }

    if (!result) {
        res.status(400).send("Bad Request")
        return
    }

    return res.status(200).send("Success Change");
});

app.get('/reports/getReports', async (req, res) => {
    let user= null;
    if (req.cookies != null && "reports_auth" in req.cookies) {
        try {
            user = await getReportUserFromToken(req.cookies.reports_auth);
        } catch (e) {
            res.json({"error": "Database error"}).status(400);
            return
        }
    }

    if (user == null) {
        res.status(401).send("Not Authorized")
        return
    }
    console.log(req.query)

    if ("id" in req.query) {
        const id = parseInt(req.query.id);
        const foundReport = reports.find(r => r.id === id);
        if (user.status !== "cadet" || foundReport.login === user.login) {
            res.status(200).json({
                "reports": [foundReport]
            });
        } else {
            res.status(403).send("Forbidden");
        }
        return
    }
    else if (user.status === "cadet") {
        const filteredReports = reports.filter(r => r.login === user.login);
        res.status(200).json({
            "reports": filteredReports
        });
        return
    }

    res.status(200).json({
        "reports": reports
    });
    return
})

app.post('/reports/createReport', async (req, res) => {
    if (req.cookies != null && "reports_auth" in req.cookies) {
        if (req.body != null && "text" in req.body) {
            const encodedToken = req.cookies.reports_auth;
            const user = await getReportUserFromToken(encodedToken);
            if (user != null) {
                try {
                    await database.createReport(user.login, req.body.text);
                    res.status(200).send("Successfully posted");
                    return;
                } catch (e) {
                    res.json({"error": "Database error"}).status(400);
                    return
                }
            }
        }
    }
    res.status(400).send("Bad Request");
});

app.listen(parseInt(process.env.HTTP_SERVER_PORT));