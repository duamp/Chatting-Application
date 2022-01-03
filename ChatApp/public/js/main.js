const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages'); //finds first occurance in CSS document.
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//1. Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io(); //Socket -> Client side

socket.emit('joinRoom', { username, room });  //2. Send 'joinRoom' task to server.

socket.on('roomUsers', ({ room, users }) => { //3. Catch 'roomUsers' and get room name + users.
  outputRoomName(room);
  outputUsers(users);
});

socket.on('message', (message) => { //4. Catch message from server, passes to functions.
  console.log(message);
  outputMessage(message); 

  chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll down
});

chatForm.addEventListener('submit', (e) => { //5. Listens if user presses send message button, then performs event.
  e.preventDefault();

  let msg = e.target.elements.msg.value;   //Get sent text message.

  msg = msg.trim(); //Remove excess characters from message.

  if (!msg) {
    return false;
  }

  socket.emit('chatMessage', msg);   //6. Send message to server, to send to other clients.

  e.target.elements.msg.value = '';   // Clear input
  e.target.elements.msg.focus();
});

function outputMessage(message) { //7. Add new messages to the DOM in div for display.
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('textmessage');
  para.innerText = message.textmessage;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room) { //Add room name to DOM
  roomName.innerText = room;
}

function outputUsers(users) { // Add users to DOM
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});

