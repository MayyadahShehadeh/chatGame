const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  socket.on("message", ({ name, message }) => {
    io.emit("message", { name, message });
  });

  socket.on("game", ({ name, number, username }) => {
    username = name;
    console.log(username);
    let randNum = Math.floor(1 + (6 - 1) * Math.random());

    if (Number(number) > randNum) {
      console.log(randNum);
      console.log("is larger");
      socket.emit("game", { username: "is larger", number });
    }
    if (Number(number) < randNum) {
      console.log(randNum);
      console.log("is small");
      socket.emit("game", { username: "is small", number });
    }
    if (Number(number) == randNum) {
      console.log(randNum);
      console.log("correct");
      io.emit("game", { name, number, username: "is correct" });
    }
  });
});

http.listen(4000, function () {
  console.log("listening on port 4000");
});
