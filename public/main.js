
$(document).ready(() => {
    let userName = prompt('Enter a user name.')
    const socket = io()
    const input = $('input')
    const flash = $('#flash')
    const connections = $('#connections')
    const messages = $('#messages')
    const typing = $('#typing')

    const showConnections = (numConnections) => {
        connections.children().remove()
        connections.append('<div>Number of connections: '+numConnections+'</div>')
    }
    let addMessage = (message, fromUser) => {
        messages.append('<div>' + fromUser + ': ' + message + '</div>')
    };

    let newFlash = (fromUser) => {
        flash.html(fromUser + ' connected!').fadeOut(5000)
    }

    let isTyping = (statement,length) => {
        if (length == 0){
            $("#typing").html("")
            return
        }
        typing.html(statement)
    }

    socket.emit('newConnection', userName)

    input.on('keyup', (event) => {
        if (event.keyCode != 13) {
            socket.emit('typing', userName + " is typing.", input.val().length)
            return;
        }

        let message = input.val()
        addMessage(message, userName)
        socket.emit('message', message, userName)
        socket.emit('typing', userName + " is typing.", 0)
        input.val('')
    })
    socket.on('connect', showConnections)
    socket.on('updateConnections', showConnections)
    socket.on('message', addMessage)
    socket.on('flash', newFlash)
    socket.on('typing', isTyping)
})
