const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  socket.on("message", ({ name, message }) => {
    io.emit("message", { name, message });
  });
  socket.on('game', ({number,name})=> {
    let randNum = Math.floor(1 + (5 - 1) * Math.random());

    if(Number(number)>randNum){
      console.log('is larger');
      console.log(randNum);
    }
    if(Number(number)<randNum){
      console.log('is small');
    }
    if(Number(number)==randNum){
      console.log('correct');
      
    }
    io.emit("game", { name,number});
    });
});




http.listen(4000, function () {
  console.log("listening on port 4000");
});
