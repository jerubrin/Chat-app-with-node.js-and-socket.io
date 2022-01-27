var readyToSent = true;
var send_message = $("#send_message");
var head = $("head");
var messageCount = 0;
var showModTools = "div.mod-tools { display: inline-flex; }"

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


  $("#hide_chat").click( () => {
      $("header").css("visibility", "hidden")
      $("section").css("visibility", "hidden")
      $("body").css("background", "transparent")
      $("#hide_chat").css("visibility", "hidden")
      $("#show_chat").css("visibility", "visible")
      
  });
    
  $("#show_chat").click( () => {
      $("header").css("visibility", "visible")
      $("section").css("visibility", "visible")
      $("body").css("background", "#28150766")
      $("#hide_chat").css("visibility", "visible")
      $("#show_chat").css("visibility", "hidden")
  });
    
  send_message.click(() => {
      if((message.val() != "") && readyToSent) {
          socket.emit("new_message", {
              message: message.val(),
              className: alertClass
          });
          message.val("");
          waitForNextMsg();
      }
  });

  var alertClass = "user"

  socket.on("add_mess", data => {
    feedback.html("");
    var adminDiv = "<div class=\"mod-tools\">" + 
        "<button id=\"remove_msg\" type=\"button\">rm</button>" +
        "<button id=\"remove_all\" type=\"button\">rAll</button>" +
        "<button id=\"ban_user\" type=\"button\">ban</button>" +
        "</div>"
    chatroom.append(
      "<div class='" + 
        "alert alert-" + data.className + "' id='num" + msgnum.toString() +
        "'>" + 
        "<b>" +
        data.username +
        "</b>: " +
        data.message +
        adminDiv +
        "</div>"
    );
    if(messageCount > 15) {
        autoHide("#num" + (msgnum-16).toString());
    }
    messageCount++;
    msgnum++;
  });
    
  socket.on('auth_user', data => {
      console.log("auth_user")
      if(data.className == "admin" || data.className == "moderator") {
         head.append("<style>" + showModTools + "</style>");
      }
  });
    
  socket.on("add_mess", data => {
      feedback.html("");
  });
    
$(document).on('keypress',function(e) {
    if(e.which == 13) {
        if (isSeted) {
            if((message.val() != "") && readyToSent) {
                socket.emit("new_message", {
                    message: message.val(),
                    className: alertClass
                });
                message.val("");
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
      socket.emit("all_messages", {message: "0"});
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
    setTimeout(hideClass, 5000, fClass);
}

function hideClass(fClass) {
    fClass.css("display", "none");
    messageCount--;
}

function waitForNextMsg() {
    readyToSent = false;
    send_message.css("background", "#b6b7d18a");
    setTimeout(sendNext, 5000);
}

function sendNext() {
    send_message.css("background", "#0e128199");
    readyToSent = true;
}


//visibility: hidden;
//visibility: visible;