const express = require('express');
const handlebars = require('express-handlebars')
const {Server} = require('socket.io')
const viewsRouter = require('./routes/views.router')
const port = 8080;

const app = express();

//config handlebars 
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

//carpeta pública
app.use(express.static(`${__dirname}/public`))

//routes
app.use('/', viewsRouter)


const httpServer = app.listen(port, ()=>console.log(`Running on port ${port}`))


let messages = []
//config socket.io 
const io = new Server(httpServer)

io.on('connection',(socket)=>{
    console.log(`Socket connected, id ${socket.id}`)

    socket.on('userMessage',(messageData)=>{
        messages.push(messageData)
        io.emit('messages',{messages})
    })

    socket.on('authenticated',({userName})=>{
        socket.emit('messages',{messages})
    
        socket.broadcast.emit('newUser', {newUserName: userName})
    })
    
})


