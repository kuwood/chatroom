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
    socket.on('newConnection', (fromUser) => {
        connectionsArray.push(fromUser)
        socket.broadcast.emit('updateConnections', numConnections)
        socket.broadcast.emit('flash', fromUser)
    })

    socket.on('message', (message, userName) => {
        socket.broadcast.emit('message', message, userName)
    })

    socket.on('typing', (statement, length) => {
        socket.broadcast.emit('typing', statement, length)
    })

    socket.on('disconnect', () => {
        numConnections--;
        socket.broadcast.emit('updateConnections', numConnections)
    })
})

server.listen(8080)
