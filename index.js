/* eslint-disable no-console */
require('dotenv').config();
const socket = require('socket.io');

const {
  env: { PORT },
} = process;
const app = require('./app');

const server = app.listen(PORT, () =>
  console.log(`server is connected @ http://localhost:${PORT}`),
);

const io = socket(server);
io.on('connection', (socketVariable) => {
  socketVariable.on('disconnecting', () => {
    const roomId = [...socketVariable.rooms].find(
      (item) => item !== socketVariable.id,
    );
    socketVariable.leave(roomId);
    const connectedUsers = io.sockets.adapter.rooms?.get(roomId)?.size || 1;
    io.to(roomId).emit('roomId', { roomId, connectedUsers });
  });

  socketVariable.on('roomId', (roomId) => {
    socketVariable.join(roomId);
    const connectedUsers = io.sockets.adapter.rooms?.get(roomId)?.size || 1;
    io.to(roomId).emit('roomId', { roomId, connectedUsers });
  });

  socketVariable.on('movieUrl', (data) => {
    console.log('check room', io.sockets.adapter.rooms?.get(data.roomId));
    io.to(data.roomId).emit('movieUrl', data.url);
  });

  // Handle typing event
  socketVariable.on('play', (data) => {
    io.to(data.roomId).emit('play', data.currentTime);
  });

  // Handle typing event
  socketVariable.on('pause', (roomId) => {
    io.to(roomId).emit('pause');
  });

  // Handle chat event
  socketVariable.on('chat', (data) => {
    io.to(data.roomId).emit('chat', data.message);
  });

  // Handle typing event
  socketVariable.on('typing', (data) => {
    io.to(data.roomId).emit('typing', data.message);
  });
});
