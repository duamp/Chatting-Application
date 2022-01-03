const users = []; //Array of Current Users.

function userJoin(id, username, room){ //Add new user to Array.
    const user = {id, username, room};
    users.push(user);
    return user;
}

function getCurrentUser(id){ //Get User Id. Created from socket.id.
    return users.find(user =>user.id = id);
}

function userLeave(id){ //Find user in Array, remove them.
    const index = users.findIndex(user => user.id===id);
    if(index !== -1){   //-1 means they never existsed.
        return users.splice(index, 1)[0];
    }
}

function getRoomUsers(room){ //Find the number of users in a certain room.
    return users.filter(user => user.room === room);
}

module.exports ={ //export functions to use in server.js/main.js
    getCurrentUser,
    userJoin,
    getRoomUsers,
    userLeave
} 
