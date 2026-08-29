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
        // Conversion en buffer/string selon la version du package ws
        const payload = message.toString();

        // Relaie le coup à TOUS les clients connectés (y compris l'expéditeur)
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(payload);
            }
        });
    });

    ws.on('close', () => {
        clients = clients.filter((c) => c !== ws);
        console.log(`Joueur déconnecté. Restants: ${clients.length}`);
    });
});

console.log(`Serveur démarré sur le port ${PORT}`);