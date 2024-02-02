const socket = io()
let userName;  

//elements 
const userNameDiv = document.getElementById("userNameDiv");
const chatBox = document.getElementById('chatBox');
const messagesLog = document.getElementById('messagesLog');

//event listeners

chatBox.addEventListener('keyup',(e)=>{
    if(e.key == 'Enter'){
        socket.emit('userMessage',{userName: userName, 
                                    message: e.target.value, 
                                    time: new Date().toLocaleTimeString() }) 
        e.target.value = ''
    }
})

//socket events 
socket.on('messages',({messages})=>{
    console.log("messages")
    if(!userName) return; 
    messagesLog.innerHTML = ''
    messages.forEach(m => {
        messagesLog.innerHTML+=`<br/>${m.time} ${m.userName}: ${m.message}`
    });

})

socket.on('newUser',({newUserName})=>{
    if(!userName) return; 
    Swal.fire({
        text: `${newUserName} se ha unido al chat`,
        toast: true, 
        position: 'top-right',
        timer:2000
    })
})


//alerts
Swal.fire({
    title: 'Identifícate',
    text: 'Necesitas un nombre de usuario',
    input: "text",
    allowOutsideClick: false, 
    inputValidator: (value) => {
        if (!value) {
          return "Necesitás un nombre de usuario para poder chatear";
        }
    }
}).then((result)=>{
    userName = result.value
    userNameDiv.innerHTML = `User: ${userName}`
    socket.emit('authenticated',{userName})
})