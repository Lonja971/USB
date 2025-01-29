import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';

//---SOCKET.IO-SETUP---

const app = express()
const port = 3002
app.use(cors({
   origin: '*',
   methods: ['GET', 'POST'],
   allowedHeaders: ['Content-Type'],
}));
const server = createServer(app);
const io = new Server(server, {
   cors: {
      origin: '*',
      methods: ['GET', 'POST'],
   },
   pingInterval: 2000,
   pingTimeout: 5000
});

const backendPlayers = {}
let currentPlayerId = ""

io.on('connection', (socket) => {
   const backendPlayerId = socket.handshake.auth.playerId;
   console.log(`A user connected: ${socket.id} | ${backendPlayerId}`);

   if (backendPlayers[backendPlayerId]){
      socket.emit('disconnectReason', `Гравець з ніком "${backendPlayers[backendPlayerId].name}" вже грає зараз. Спробуйте зайти ще раз пізніше.`)
      socket.disconnect(true);
      console.log(`Гравець з ${socket.id} відключений.`)
   }else{
      backendPlayers[backendPlayerId] = {
         socketId: socket.id,
         name: `${backendPlayerId} name`
      };
      function greeting() {
         socket.emit('playerData', {name: backendPlayers[backendPlayerId].name});
      }
      setTimeout(greeting, 5000);
   }

   io.emit('updatePlayers', backendPlayers)

   socket.on('sendId', (id) => {
      currentPlayerId == id
      console.log("Current Player Id:")
      console.log(id)

      socket.emit('helloYou', "ПРИВІТ")
      io.emit('helloAll', "ПРИВІТ")
   })
 
   socket.on('disconnect', (reason) => {
     console.log(`Player ${socket.id} disconected: ${reason}`)
     delete backendPlayers[backendPlayerId]
 
     io.emit('updatePlayers', backendPlayers)
   })
 
});

//setInterval(() => {
//   console.log(`Лист гравців:`)
//   console.log(backendPlayers)
//},5000)
 
server.listen(port, () => {
   console.log(`[ :3 ] Server started: http://localhost:${port}`)
})