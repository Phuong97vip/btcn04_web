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


socket.on('message', data => {
    if (data.user.id != user.id) {
        $(`.chatContent`).append(`<div class=" mb-3 text-start">${data.user.nickname}: <button  style="max-width: 50%;" class=" text-start btn btn-primary disabled" >${data.mss}</button></div>`)
    }
    $(`.chatContent`).scrollTop($(`.chatContent`)[0].scrollHeight);
})

socket.on('listMss', listMss => {
    $(`.chatContent`).empty();
    for (const data of listMss) {
        if (data.user.id != user.id) {
            $(`.chatContent`).append(`<div class=" mb-3 text-start">${data.user.nickname}: <button  style="max-width: 50%;" class=" text-start btn btn-primary disabled" >${data.mss}</button></div>`)
        } else {
            $(`.chatContent`).append(`<div class=" mb-3 text-end"><button  style="max-width: 50%;" class=" text-start btn btn-primary disabled" >${data.mss}</button></div>`)
        }
    }
    $(`.chatContent`).scrollTop($(`.chatContent`)[0].scrollHeight);
})

$('.sendmss').on('click', (e) => {
    e.preventDefault();
    if ($('.inputmss').val() != null && $('.inputmss').val() != '') {
        $(`.chatContent`).append(`<div class=" mb-3 text-end"><button  style="max-width: 50%;" class=" text-start btn btn-primary disabled" >${$('.inputmss').val()}</button></div>`)
        socket.emit('message', { user: user, mss: $('.inputmss').val() });
        $(`.chatContent`).scrollTop($(`.chatContent`)[0].scrollHeight);
        $('.inputmss').val('');
    }
})



