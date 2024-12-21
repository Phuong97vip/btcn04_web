let onlineTable = $('.onlineTable')

const socket = io('https://localhost:21534');
socket.on('connect', function () {
    socket.emit('goOnline', user);
});

window.addEventListener('beforeunload', (event) => {
    socket.emit('offline', user);
    socket.disconnect();
});

socket.on('online', data => {
    onlineTable.empty();
    for (const onlineUser of data) {
        if (onlineUser.id != user.id) {
            onlineTable.append(`<p class="card-text"><i class="fa-regular me-2 fa-circle" style="color: #05f509;" ></i>${onlineUser.nickname}</p>`)
        }
    }
})





