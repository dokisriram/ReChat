const socket = io('http://localhost:8000');

//Get DOM  elements in respective JS variables
const form = document.getElementById('send-container');
const messageinput = document.getElementById('messageinp');
const messagecontainer = document.querySelector(".container");

// Audio that will play on receiving message
var audio = new Audio('not.mp3');


// Function which will append envent info to the container
const append = (message, position)=>{
    const messageelement = document.createElement('div');
    messageelement.innerText = message;
    messageelement.classList.add('message')
    messageelement.classList.add(position)
    messagecontainer.append(messageelement);
    if(position == 'left'){
        audio.play();
    }
}

// Ask new user for his/her name and let the server know
const name = prompt('Enter your name to join');
socket.emit('new-user-joined', name);

//If new user joins, receive his/her name from the server
socket.on('user-joined', data =>{
append(`${name} joined the chat`, 'right');
})

// if server sends a message reveive it
socket.on('receive', data =>{
append(`${data.name}: ${data.message}`, 'left');
})


//if a user leaves the chat, append the info to the container
socket.on('left', name =>{
append(`${name} left the chat`, 'right');
})

// if the form gets submitted send server the message
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageinput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageinput.value = "";
})
