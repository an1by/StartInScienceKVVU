import config from "../config.json" assert {type: 'json'}
import mysql from 'mysql2/promise';
import {reportUsers, ReportUser} from "../modules/ReportUserModule.js";
import {Report, reports} from "../modules/ReportModule.js";
import {ACSUser, acsUsers} from "../modules/ACSUserModule.js";

const reportUsersTable = "reports_users";
const acsUsersTable = "acs_users";
const reportsTable = "reports_reports";
export default class Database {
    constructor() {
        this.connectionData = config.mysql;
        this.pool = null;
    }

    async connect() {
        this.pool = await mysql.createPool(this.connectionData);

        await this.createTablesIfNotExists();
        await this.loadReports();
    }

    async getReportUserWithLogin(login) {
        let user = reportUsers.find(u => u.login === login)
        if (user == null) {
            const [rows, fields] = await this.pool.query(
                `SELECT * FROM ${reportUsersTable} WHERE login = ?`,
                [login]
            );
            if (rows.length > 0) {
                const row = rows[0]
                user = new ReportUser(row.id, row.login, row.name, row.status);
            }
        }
        return user;
    }

    async getACSUser(login, password) {
        let user = acsUsers.find(u => u.login === login)
        if (user == null) {
            console.log("SELECT * FROM " + acsUsersTable + " WHERE login = '" + login + "' AND password = '" + password + "'")
            const [rows, fields] = await this.pool.query(
                "SELECT * FROM " + acsUsersTable + " WHERE login = '" + login + "' AND password = '" + password + "'"
            );
            if (rows.length > 0) {
                const row = rows[0]
                user = new ACSUser(row.id, row.login);
            }
        }
        return user;
    }

    async getReportUser(login, password) {
        let user = reportUsers.find(u => u.login === login)
        if (user == null) {
            const [rows, fields] = await this.pool.query(
                `SELECT * FROM ${reportUsersTable} WHERE login = ? AND password = ?`,
                [login, password]
            );
            if (rows.length > 0) {
                const row = rows[0]
                user = new ReportUser(row.id, row.login, row.name, row.status);
            }
        }
        return user;
    }

    async createReport(login, text) {
        const [result, fields] = await this.pool.query(
            `INSERT INTO ${reportsTable} (login, text, status) VALUES (?, ?, ?)`,
            [login, text, "wait"]
        );

        new Report(result.insertId, login, text, "wait");
    }

    async updateReport(id, status) {
        const foundReport = reports.find(r => r.id === id);
        if (foundReport == null)
            return false;
        if (status !== "accepted" && status !== "declined")
            return false;
        foundReport.status = status;
        const [result, fields] = await this.pool.query(
            `UPDATE ${reportsTable} SET status = ? WHERE id = ?`,
            [status, id]
        );
        return true;
    }

    async loadReports() {
        const [rows, fields] = await this.pool.query(`SELECT * FROM ${reportsTable}`);
        rows.forEach(report => {
            new Report(report.id, report.login, report.text, report.status)
        });
    }

    async createTablesIfNotExists() {
        await this.pool.query(`CREATE TABLE IF NOT EXISTS \`${reportsTable}\` (` +
            "`id` INT NOT NULL AUTO_INCREMENT," +
            "`login` VARCHAR(16) NOT NULL," +
            "`text` TEXT NOT NULL," +
            "`status` VARCHAR(16) NOT NULL," +
            "PRIMARY KEY (`id`)" +
            ");");

        await this.pool.query(`CREATE TABLE IF NOT EXISTS \`${acsUsersTable}\` (` +
            "`id` INT NOT NULL AUTO_INCREMENT," +
            "`login` VARCHAR(16) NOT NULL," +
            "`password` VARCHAR(64) NOT NULL," +
            "PRIMARY KEY (`id`)" +
            ");");

        await this.pool.query(`CREATE TABLE IF NOT EXISTS \`${reportUsersTable}\` (` +
            "`id` INT NOT NULL AUTO_INCREMENT," +
            "`login` VARCHAR(16) NOT NULL," +
            "`password` VARCHAR(64) NOT NULL," +
            "`name` VARCHAR(255) NOT NULL DEFAULT 'Неизвестный пользователь'," +
            "`status` VARCHAR(16) NOT NULL DEFAULT 'cadet'," +
            "PRIMARY KEY (`id`)" +
            ");");
    }

    disconnect() {
        this.pool.disconnect()
    }
}