const express = require('express');
const path = require('path');

const {encrypt, decrypt, generateRSAKeys} = require('./r-s-a');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname,'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
 
app.use('/',(req , res) =>{
  res.render('index.html');
});

let messages =[];

let keys = generateRSAKeys();
let publicKey = keys.publicKey;
let privateKey = keys.privateKey;

io.on('connection', socket  => {
    console.log(`Socket conectado: ${socket.id}`);
    
    socket.emit('previousMessages', messages);
  
    socket.on('sendMessage', data =>{
        const encryptedMessage = encrypt(data.message, publicKey);

        // Adiciona a mensagem criptografada ao objeto de dados
        const encryptedData = {
          author: data.author,
          message: encryptedMessage,
        };

      console.log(`Nova mensagem enviada: Autor: ${data.author}, Mensagem Criptografada: ${encryptedMessage}`);
      
        const decryptedMessage = decrypt(encryptedMessage, privateKey);

        const decryptedData = {
            author: encryptedData.author,
            message: decryptedMessage
        };
      messages.push(decryptedData);
      socket.broadcast.emit('receivedMessage', decryptedData);
      console.log(`Nova mensagem recebida: Autor: ${encryptedData.author}, Mensagem Descriptografada: ${decryptedMessage}`);

    });
  });
  

server.listen(3000, '0.0.0.0');