require('dotenv').config();
const express = require('express');
const env = process.env;
const configStaticResource = require('./configs/configStaticResource');
const configViewEngine = require('./configs/configViewEngine');
const configHttps = require('./configs/ConfigHttps');
const configSession = require('./configs/configSession');
const configPassport = require('./configs/configOauth2Passport');
const cookieParser = require('cookie-parser');
const User = require('./models/GameServer/user.m')
const path = require('path');
const port = env.GAME_SERVER_PORT ||21534;
const app = express();



// config
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
configStaticResource(app, path.join(__dirname, 'public'));
configSession(app);
configPassport(app);
configViewEngine(app, path.join(__dirname, 'views'));



// routes
app.use('/api', require('./routes/GameRouter/api.r'));
app.use(require('./routes/GameRouter/auth.r'));
app.use(require('./routes/GameRouter/site.r'));


// Https
const server = configHttps(app, path.join(__dirname, 'certs'));


const onlineUser = [];
const listMassage = [];
let waitingMatch = [];
let playingMatch = [];

const addMessage = (user, mss) => {
    const mssData = {
        user: user,
        mss: mss
    }
    listMassage.push(mssData);
}

const addOnlineUser = (newUser) => {
    let hasUser = false;
    for (const user of onlineUser) {
        if (user.id == newUser.id) {
            hasUser = true;
            break;
        }
    }
    if (!hasUser) onlineUser.push(newUser);
}

const remmoveOnlineUser = (user) => {
    let index = -1;
    for (let i = 0; i < onlineUser.length; i++) {
        if (onlineUser[i].id == user.id) {
            index = i;
            break;
        }
    }
    if (index > -1) onlineUser.splice(index, 1);
}

const io = require('socket.io')(server);

io.on('connection', socket => {
    socket.on('join', room => {
        socket.join(room);
    })
    socket.on('offline', user => {
        remmoveOnlineUser(user);
        io.emit('online', onlineUser);
    })
    socket.on('goOnline', user => {
        addOnlineUser(user);
        io.emit('online', onlineUser)
        io.emit('listMss', listMassage);
        io.emit('getMatch', {
            waitingMatch: waitingMatch,
            playingMatch: playingMatch
        });
    })
    socket.on('message', data => {
        const { user, mss } = data;
        addMessage(user, mss);
        io.emit('message', data);
    })

    socket.on('directMss',data => {
        const  {user,room,mss} = data;
        socket.to(room).emit('directMss',data);
    })

    socket.on('gameOver', async (data) => {
        const match = playingMatch.find(room => room.id == data.room);
        if(match) {
            if(data.winnerValue == 'draw') {
                await User.UpdateScore(match.p1.info.id,1)
                await User.UpdateScore(match.p2.info.id,1)
                io.to(data.room).emit('gameOver',{winner: "Draw"})
                playingMatch = playingMatch.filter(room => room.id != data.room);
            } else if(data.winnerValue == 'O') {
                await User.UpdateScore(match.p1.info.id,2)
                io.to(data.room).emit('gameOver',{winner: match.p1.info.id})
                playingMatch = playingMatch.filter(room => room.id != data.room);
            } else if(data.winnerValue == 'X') {
                await User.UpdateScore(match.p2.info.id,2)
                io.to(data.room).emit('gameOver',{winner: match.p2.info.id})
                playingMatch = playingMatch.filter(room => room.id != data.room);
            }
           
        }
    })

    socket.on('cancelCreate',data => {
        waitingMatch = waitingMatch.filter(room => room.id != data)
        io.emit('getMatch', {
            waitingMatch: waitingMatch,
            playingMatch: playingMatch
        });
    })

    socket.on('playing', data => {
        const match = playingMatch.find(room => room.id == data.room)
        let turnValue = match.sum % 2 == 0 ? 'X' : 'O';
        newTurn = turnValue == 'O' ? 'X' : 'O';
        if (data.value == turnValue) {
            match.sum += 1;
            io.to(match.id).emit('playing', { btn: data.id, value: data.value, newTurn: newTurn })
        }
    })

    socket.on('find', data => {
        if (waitingMatch.find(room => room.id == data.room) == undefined) {
            let room = {
                id: data.room,
                player: [],
                type: data.type
            }
            waitingMatch.push(room);
        }
        if (waitingMatch.find(room => room.id == data.room).player.find(player => player.id == data.player.id) == undefined) {
            waitingMatch.find(room => room.id == data.room).player.push(data.player);
        }
        if (waitingMatch.find(room => room.id == data.room).player.length >= 2) {
            let match = {
                id: waitingMatch.find(room => room.id == data.room).id,
                p1: {
                    info: waitingMatch.find(room => room.id == data.room).player[0],
                    value: 'O'
                },
                p2: {
                    info: waitingMatch.find(room => room.id == data.room).player[1],
                    value: 'X'
                },
                sum: 1,
                type: waitingMatch.find(room => room.id == data.room).type
            }
            playingMatch.push(match);
            waitingMatch = waitingMatch.filter(room => room.id != data.room);
            io.to(data.room).emit('find', match);
        }

        io.emit('getMatch', {
            waitingMatch: waitingMatch,
            playingMatch: playingMatch
        });
    })
     
})


server.listen(port, () => {
    console.log(`GameServer is listening on port ${port} - ${env.HOST}`)
})

