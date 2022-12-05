const socket = io();

const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
console.log(username, room);

//join chat room
socket.emit('joinRoom', { username, room });

socket.on('message', (msg) => {
    console.log(msg);
    outputMessage(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Get room and users info
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    socket.emit('chatMessage', msg);

    //clear inputs
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

//Output msg to DOM
const outputMessage = (msgObj) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${msgObj.username} <span>${msgObj.time}</span></p>
    <p class="text">
        ${msgObj.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
};

//Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}<li/>`).join('')}
    `;
}
