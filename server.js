const WebSocket = require('ws');
const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

let clients = [];

wss.on('connection', (ws) => {
    if (clients.length < 2) {
        clients.push(ws);
        console.log(`Joueur connecté. Total: ${clients.length}`);
    } else {
        ws.close();
        return;
    }

    ws.on('message', (message) => {
        clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        clients = clients.filter((c) => c !== ws);
        console.log('Joueur déconnecté');
    });
});

console.log(`Serveur démarré sur le port ${PORT}`);