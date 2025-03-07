// Importando as dependências
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Criando o servidor Express e Socket.io
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Definindo a porta dinâmica para o Render
const PORT = process.env.PORT || 3000; // Porta fornecida pelo Render ou 3000 localmente

// Servindo os arquivos estáticos (HTML, CSS, JS) da pasta 'public'
app.use(express.static('public'));

// Quando um usuário se conecta ao servidor
io.on('connection', (socket) => {
    console.log('Novo usuário conectado');
    
    // Evento de entrada: salva o nome do usuário no socket
    socket.on('entrar', (nomeUsuario) => {
        socket.username = nomeUsuario;
        console.log(nomeUsuario + ' entrou no chat');
        socket.broadcast.emit('user joined', nomeUsuario);  // Emitir para os outros usuários
    });

    // Evento de mensagem do chat: usa o nome salvo no socket
    socket.on('chat message', (data) => {
        console.log('Mensagem recebida: ' + data.msg);
        io.emit('chat message', { user: socket.username, msg: data.msg });  // Enviar para todos os clientes conectados
    });

    // Quando o usuário se desconecta
    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });
});

// Iniciando o servidor na porta correta
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

