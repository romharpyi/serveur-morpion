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
		const payload = message.toString();

		clients.forEach((client) => {
			// Envoi uniquement à l'AUTRE joueur
			if (client !== ws && client.readyState === WebSocket.OPEN) {
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