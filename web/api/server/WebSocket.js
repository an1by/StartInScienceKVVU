import WebSocket from "ws";

const server = new WebSocket.Server({port: parseInt(process.env.WEBSOCKET_PORT)});

server.on('error', console.error);

export let socketClients = {
    "field": null,
    "client": []
}

export let deviceState = {}

server.on('connection', async (socket) => {
    console.log(`${socket.remoteAddress} connected`);

    socket.on('message', function message(data) {
        if (data.startsWith("auth|")) {
            if (socketClients.client.includes(socket) || socketClients.field === socket) {
                return;
            }

            const key = data.split("|")[0];
            if (key === process.env.WEBSOCKET_CLIENT_AUTH_KEY) {
                socketClients.client.push(socket);
                socket.send("auth|success");
                return;
            } else if (socketClients.field == null && key === process.env.WEBSOCKET_FIELD_AUTH_KEY) {
                socketClients.field = socket;
                socket.send("auth|success");
                return;
            }
            socket.send("auth|failed");
        }
        if (data.startsWith("get_state")) {
            if (socketClients.client.includes(socket) || socketClients.field === socket) {
                for (let key in deviceState) {
                    let value = deviceState[key];
                    socket.send(`update_state|${key}|${value}`)
                }
            }
        }
        if (data.startsWith("update_state|")) {
            if (socketClients.client.includes(socket) && socketClients.field != null) {
                const split = data.split("|");
                deviceState[split[1]] = split[2];
                socketClients.field.send(data)
            }
        }
    });

    socket.on('close', () => {
        const index = socketClients.client.indexOf(socket);
        if (index >= 0) {
            socketClients.client.slice(index, 1);
            console.log(`${socket.remoteAddress} disconnected`);
        } else if (socketClients.field === socket) {
            socketClients.field = null;
        }
    });
});