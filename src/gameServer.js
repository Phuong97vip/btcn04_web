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
     
})


server.listen(port, () => {
    console.log(`GameServer is listening on port ${port} - ${env.HOST}`)
})

