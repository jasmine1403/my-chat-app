const http=require("http");
const express=require("express");
const cors=require("cors");
const socketIo=require("socket.io");

const users=[{}];
const app=express();
const port=4500 || process.env.PORT;
// either 4500 or whatever port u get

app.use(cors());

app.get("/",(req,res)=>{
  res.send("YOOOHOO");

})


const server=http.createServer(app);
const io=socketIo(server);

io.on("connection",(socket)=>{
  console.log("New Connection");

  socket.on('joined',({user})=>{
        users[socket.id]=user;
        console.log(`${user} has joined `);
        socket.broadcast.emit('userJoined',{user:"Admin",message:` ${users[socket.id]} has joined`});
        socket.emit('welcome',{user:"Admin",message:`Welcome to the chat,${users[socket.id]} `})
  })

socket.on('message',({message,id})=>{
  io.emit('sendMessage',{user:users[id],  message,id});
})

socket.on('disconnect',()=>{
  socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]}  has left`});
console.log(`user left`);
});

})

server.listen(port,()=>{
  console.log(`server is working on http://localhost:${port} `);
}
)