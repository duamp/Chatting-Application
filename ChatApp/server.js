const path = require('path'); //easily interact with file path.
const http = require('http'); //supports communication protocol.
const express = require('express'); //web application framework.
const socketio = require('socket.io'); //two way communication (Server <-> Client).
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server); //io -> Server Side.
const botName = 'ChatCord Bot';

// 1. Static folder w/ CSS + HTML + JS.
app.use(express.static(path.join(__dirname, 'public')));

// 2. Monitor connections.
io.on('connection', socket => { //i.e., emit events 'on' on side server. catch 'on' client side.

  //3. Build with multiple rooms, for the development of different games with different chats.
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    //4. Welcome new user to chat room.
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

    //5. "Broadcast" connection. (Display to everyone recently but connected client).
    socket.broadcast
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    //6. Get Number of Users in the room. For side menu. 
    io.emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  //7. Listen for new messages. 
  socket.on('chatMessage', msg => { // Custom emit response. 'chatMessage'.
    const user = getCurrentUser(socket.id);
    io.emit('message', formatMessage(user.username, msg));
  });

  //8. When disconnection occours, remove user from List + announce leaving.
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if (user) {
      io.emit('message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      //9. Send update to client side.
      io.emit('roomUsers', { // Custom emit response. 'roomUsers'.
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

