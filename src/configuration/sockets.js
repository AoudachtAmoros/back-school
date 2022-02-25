//const sockets = require('../controller/sockets')
const parentController = require('../controller/parent')

var studentSocket = []
var parentSocket = []
var studentS;
var parentS;

module.exports.start = async function (http){ 
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
            setSocketID('parent',socket.id)
            console.log('parentArea connection');
        })
        socket.on('studentArea',async()=>{
            setSocketID('student',socket.id)
            console.log('studentArea connection');
        })
        //socket firstScan
        socket.on('firstScan',async(data)=>{
            console.log('first');
            return
            let response = await parentController.firstScan(data) 
            console.log(response);
            return
            if (response.status==200){
                addParent('parent',data);
            }

            let psocket = getSocketID('parent')
            let ssocket = getSocketID('student')
            io.to(ssocket).emit('firstScan',response); 
            io.to(psocket).emit('firstScan',response);
            })
             //socket secondScan    
        socket.on('secondScan',async(data)=>{
            console.log('second');
         return
                let response = await parentController.secondScan(data) 
                if (response.status==200){
                    let res = removeParent(data);
                    response.res = res
                }
                let psocket = getSocketID('parent')
                let ssocket = getSocketID('student')
                io.to(ssocket).emit('secondScan',response); 
                io.to(psocket).emit('secondScan',response);
                console.log(response);
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
 
function addParent(actor,data){
    switch(actor){
        case 'parent' :{
            parentSocket.push(data)
            break
        }
        case 'student' :{
            studentSocket.push(data)
            break
        }
    }
}
function removeParent(data){
    let response = false
    for(let i=0;i<parentSocket.length;i++){
        if(data.RFID == parentSocket[i].RFID){
            parentSocket.splice(i,1)
            response = true 
        }
    }
    return response
}

function setSocketID(actor,id){
    switch(actor){
        case 'parent' :{
            parentS=id
            break
        }
        case 'student' :{
            studentS=id
            break
        }
    }

}
function getSocketID(actor,id){
    switch(actor){
        case 'parent' :{
            return parentS
            break
        }
        case 'student' :{
            return studentS
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

