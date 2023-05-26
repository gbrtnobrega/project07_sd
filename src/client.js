const {generateRSAKeys, encrypt, decrypt} = require('./r-s-a');
const WebSocket = require('ws');

let keys = generateRSAKeys();
let publicKey = keys.publicKey;
let privateKey = keys.privateKey;
// Configurações do cliente websocket
const ws = new WebSocket('ws://localhost:8080');

// Função para criptografar a mensagem usando a chave pública do servidor


// Evento de abertura da conexão com o servidor
ws.on('open', () => {
  console.log('Conexão estabelecida com o servidor');

  // Evento de recebimento de mensagem do servidor
  ws.on('message', encryptedMessage => {
    const message = decrypt(encryptedMessage, privateKey);
    console.log('Mensagem recebida:', message);
  });

  // Função para enviar uma mensagem para o servidor
  function sendMessage(message) {
    ws.send(encrypt(message, publicKey));
  }

  // Exemplo de envio de mensagem para o servidor
  sendMessage('Olá, servidor!');
});

