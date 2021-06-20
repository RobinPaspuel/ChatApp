const chatform = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

//message from server

socket.on('message', message =>{
    console.log(message);
    outputMessage(message);

    //Focus message
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

//Message submition

chatform.addEventListener('submit', (e)=>{
    e.preventDefault();

    //get message text
    const msg = e.target.elements.msg.value;

    //emit message to server
    socket.emit('chatMessage', msg);

    //clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//output message
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">Brad <span>9:12pm</span></p>
    <p class="text">
        ${message}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}