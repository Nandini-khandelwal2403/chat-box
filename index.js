const express = require('express')
const app = express()
const http = require('http')
const socketio = require('socket.io')
const server = http.createServer(app)
const io = socketio(server)


// understand
const formatMessage = require('./helpers/formatDate')
const {
    getActiveUser,
    exitRoom,
    newUser,
    getIndividualRoomUsers
} = require('./helpers/userHelper');

io.sockets.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = newUser(socket.id, username, room);
        socket.join(user.room)

        socket.emit('message', formatMessage('WebCage', 'Messages limited to a room'))

        socket.broadcast.to(user.room).emit('message', formatMessage("WebCage", `${user.username} has joined the room`))

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getIndividualRoomUsers(user.room)
        })
    })

    socket.on('chatMessage', msg => {
        const user = getActiveUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })

    socket.on('disconnect', () => {
        const user = exitRoom(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage("WebCage", `${user.username} has left the room`))
        }

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getIndividualRoomUsers(user.room)
        })
    })


})

const PORT = process.env.PORT || 3000;

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/public/views/chat.html')
})

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/views/index.html')
})

server.listen(PORT, () => {
    console.log('app is alive');
})

const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))


