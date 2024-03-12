export let reports = []

export class Report {
    constructor(id, login, text, status) {
        this.id = id;
        this.login = login;
        this.text = text;
        this.status = status;

        reports.push(this);
    }
}