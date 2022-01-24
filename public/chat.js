var readyToSent = true;
var send_message = $("#send_message");

$(function() {
  var socket = io.connect("http://localhost:3000");

  var message = $("#message");
  var username = $("#username");
  var send_username = $("#send_username");
  var chatroom = $("#chatroom");
  var feedback = $("#feedback");
  var change_username = $("#change_username");
  var input_zone = $("#input_zone");
  var isSeted = false;
  var msgnum = 0;

  send_message.click(() => {
    socket.emit("new_message", {
      message: message.val(),
      className: alertClass
    });
  });
  var min = 1;
  var max = 6;
  var random = Math.floor(Math.random() * (max - min)) + min;

  // Устаналиваем класс в переменную в зависимости от случайного числа
  // Эти классы взяты из Bootstrap стилей
  var alertClass;
  switch (random) {
    case 1:
      alertClass = "secondary";
      break;
    case 2:
      alertClass = "danger";
      break;
    case 3:
      alertClass = "success";
      break;
    case 4:
      alertClass = "warning";
      break;
    case 5:
      alertClass = "info";
      break;
    case 6:
      alertClass = "light";
      break;
  }

  socket.on("add_mess", data => {
    feedback.html("");
    message.val("");
    chatroom.append(
      "<div class='" + 
        "alert alert-" + data.className + "' id='num" + msgnum.toString() +
        "'>" + 
        "<b>" +
        data.username +
        "</b>: " +
        data.message +
        "</div>"
    );
    autoHide("#num" + msgnum.toString())
    msgnum++
  });
    
$(document).on('keypress',function(e) {
    if(e.which == 13) {
        if (isSeted) {
            if((message.val() != "") && readyToSent) {
                socket.emit("new_message", {
                    message: message.val(),
                    className: alertClass
                });
                waitForNextMsg();
            }
        } else {
            if(username.val() != "") {
                socket.emit("change_username", { username: username.val() });
                change_username.css("display", "none");
                input_zone.css("display", "flex");
                isSeted = true;
            }
        }
    }
});

  send_username.click(() => {
      if((username.val() != "") && readyToSent) {
          socket.emit("change_username", { username: username.val() });
          change_username.css("display", "none");
          input_zone.css("display", "flex");
          isSeted = true;
      }
  });

  message.bind("keypress", () => {
    socket.emit("typing");
  });

  socket.on("typing", data => {
    feedback.html(
      "<p><i>" + data.username + " печатает сообщение..." + "</i></p>"
    );
  });
});

function autoHide(className) {
    var fClass = $(document).find(className)
    setTimeout(hideClass, 30000, fClass);
}

function hideClass(fClass) {
    fClass.css("display", "none")
}

function waitForNextMsg() {
    readyToSent = false;
    send_message.css("background", "#b6b7d18a")
    setTimeout(sendNext, 5000);
}

function sendNext() {
    send_message.css("background", "#0e128199")
    readyToSent = true
}