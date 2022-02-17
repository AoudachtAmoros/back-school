const sockets = require('../Controller/sockets')
const parentController = require('../controller/parent')

var studentSocket = null
var parentSocket = null

module.exports.start =async function (http){
    console.log('start sockets');

    const io = require('socket.io')(http,{
        cors :{
            origin:'*'
        },
        pingInterval: 5000,
        pingTimeout: 5000,
    })
    // redis.redisServer()
    io.on('connection',(socket)=> {
        // console.log('new connection',socket.id);
        socket.on('parentArea',async()=>{
            setID('parent',socket.id)
            console.log('parentArea connection');
        })
        socket.on('studentArea',async()=>{
            setID('student',socket.id)
            console.log('studentArea connection');
        })
        // 
        socket.on('parentEvent',async(data)=>{
            console.log('studentSocket',studentSocket);
            console.log('parentEvent data',data);
            let response = await parentController.sGetParent(data) 
            console.log('send parent event',);
            socket.emit('parentEvent',response)
            if (response.status==200) {
                console.log('send student event',);
                let id = getID('student')
                io.to(id).emit("studentEvent", response);
            }
        })
        socket.on('studentDone',async()=>{
            let id = getID('parent')
            io.to(id).emit("parentDone");
        })
        socket.on("connect_error", () => {
            // low-level connection
            // connection is denied by the server in a middleware
            console.log('connect_error ...',socket.id); 
            // must reconnect after a given delay.
        });
        socket.on("reconnect_attempt", () => {
            console.log('reconnection ...',socket.id); 
            // ...
        });
        // 
        socket.on("reconnect", () => {
            console.log('reconnected',socket.id); 
            // ...
        });
        // 
        socket.on("disconnect",async () => {
            // try {
            //     let index = onlineUsers.findIndex(item => item.socketID==socket.id)
            //     onlineUsers.splice(index,1)
            //     console.log('disconnected');
            // } catch (error) {
            //     console.log(error);
            // }
        });
    })
}
function setID(actor,id){
    switch(actor){
        case 'parent' :{
            parentSocket = id
            break
        }
        case 'student' :{
            studentSocket = id
            break
        }
    }
}
function getID(actor){
    switch(actor){
        case 'parent' :{
            return parentSocket
            break
        }
        case 'student' :{
            return studentSocket
            break
        }
    }
}

