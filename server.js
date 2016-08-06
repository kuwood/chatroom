const socket_io = require('socket.io')
const http = require('http')
const express = require('express')
let numConnections = 0

const app = express()
app.use(express.static('public'))

const server = http.Server(app)
const io = socket_io(server)

io.on('connection', (socket) => {
    numConnections++;
    console.log(numConnections);
    socket.emit('updateConnections', numConnections)
//    socket.emit('newUser', )
    socket.on('newConnection', (fromUser) => {
        socket.broadcast.emit('updateConnections', numConnections)
        socket.broadcast.emit('flash', fromUser)

    })

    socket.on('message', (message, userName) => {
        console.log('Received message:', message, userName)
        socket.broadcast.emit('message', message, userName)
    })

    socket.on('typing', (statement, length) => {
        console.log('typing '+statement);
        socket.broadcast.emit('typing', statement, length)
    })

    socket.on('disconnect', () => {
        numConnections--;
        console.log("now:",numConnections);
        socket.broadcast.emit('updateConnections', numConnections)
    })
})

server.listen(8080)
