const express = require("express");
const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get('/', (req, res) => {
	res.render('index')
})
server = app.listen("3000", () => console.log("Server is running..."));

const io = require("socket.io")(server);

var messages = ["Добро пожаловать в чат трансляции!", "Будьте дружелюбны и общительны, благословений вам!"];
var usernames = ["Администратор", "Администратор"];
var classNames = ["admin", "admin"];
var messageCount = 2;

var passwordName = "WolKrg2022"
var passwordRoma = "RomaWol22"
var passwordMod = "ModWol22"
var passwordPastor = "PastorWol22"

io.on('connection', (socket) => {
	console.log('New user connected ' + socket.id);
    
    start = (messageCount - 15) < 0 ? 0 : messageCount - 15
    for (var i = start; i < messageCount; i++) {
        socket.emit('add_mess', {message : messages[i], username : usernames[i], className:classNames[i]});
    }
    console.log("all_messages " + messageCount);

	socket.username = "Гость"
    socket.className = "user"

    
    //Авторизация
    socket.on('change_username', (data) => {
        if (data.username == passwordName) {
            socket.username = "Администратор";
            socket.className = "admin";
        } else if (data.username == passwordRoma) {
            socket.username = "Роман Фалько";
            socket.className = "moderator";
        } else if (data.username == passwordMod) {
            socket.username = "Модератор";
            socket.className = "moderator";
        } else if (data.username == passwordPastor) {
            socket.username = "Пастор";
            socket.className = "moderator";
        } else if (data.username != "Администратор" || data.username != "Админ" || data.username != "Admin") {
            socket.username = data.username;
            socket.className = "user";
        } else {
            socket.username = "Хацкер";
            socket.className = "user";
        }
        console.log(socket.username + " as " + socket.className + " id:" + socket.id);
        socket.emit('auth_user', {className : socket.className});
    });

    //Новое сообщение
    socket.on('new_message', (data) => {
        io.sockets.emit('add_mess', {message : data.message, username : socket.username, className:socket.className});
        addNewMsg(data.message, socket.username, socket.className);
        console.log("new_message " + messageCount);
    });

    //Печатает
    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username})
    });
    
    socket.on('remove_msg', (data) => {
        
    });
    
    socket.on('remove_all', (data) => {
        
    });
    
    socket.on('ban_user', (data) => {
        
    });
    
})

function addNewMsg(message, username, className){
    messages.push(message);
    usernames.push(username);
    classNames.push(className);
    messageCount++
}
