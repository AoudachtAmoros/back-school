//const sockets = require('../controller/sockets')
const parentController = require('../controller/parent')

var scannedParents = []
var parentsArea = [];
var studentArea = null;

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
        socket.on('parentArea',async(data)=>{
            setSocketID('parent',{area:data.area,socket:socket.id})
            console.log('parentArea connection',{area:data.area,id:socket.id});
        })
        socket.on('studentArea',async(data)=>{
            setSocketID('student',{area:data.area,socket:socket.id})
            console.log('studentArea connection',{area:data.area,id:socket.id});
        })
        //socket firstScan
        socket.on('firstScan',async(data)=>{
            console.log('first');
            let parentArea = getSocketID('parent',data.area)
            let studentArea = getSocketID('student',data.area)
            if (!getParent(data)) {
                let response = await parentController.firstScan(data) 
                if (response.status==200){
                    addParent('parent',data);
                    io.to(studentArea.socket).emit('firstScan',response); 
                }
                io.to(parentArea.socket).emit('firstScan',response);
            }else{
                io.to(parentArea.socket).emit('firstScan',{status: 403, error :'User already scanned, Go to second scan'}); 
            }
        })
        //socket secondScan 
           
        socket.on('secondScan',async(data)=>{
                console.log('second');
                let parentArea = getSocketID('parent',data.area)
                let studentArea = getSocketID('student',data.area)
                if(getParent(data)){
                    response = await parentController.secondScan(data) 
                    if (response.status==200){
                        removeParent(data)
                        io.to(studentArea.socket).emit('secondScan',response); 
                    }
                    io.to(parentArea.socket).emit('secondScan',response);
                }else{
                    io.to(parentArea.socket).emit('secondScan',{status: 403, error :'Scan in first scanner first'}); 
                }
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
            removeSocketID(socket.id)
        });
     
    })
}
 
function addParent(actor,data){
    switch(actor){
        case 'parent' :{
            scannedParents.push(data)
            break
        }
    }
}
function getParent(data){
    let parent = scannedParents.filter(parent => parent.RFID == data.RFID)
    if (parent.length>0) {
        console.log('parent exist');
        return true   
    }else{
        console.log('parent not exist');
        return false   
    }
}
function removeParent(data){
    let response = false
    for(let i=0;i<scannedParents.length;i++){
        if(data.RFID == scannedParents[i].RFID){
            scannedParents.splice(i,1)
            response = true 
        }
    }
    return response
}
// 



function setSocketID(actor,data){
    switch(actor){
        case 'parent' :{
            parentsArea.push({
                area:data.area,
                socket:data.socket
            })
            break
        }
        case 'student' :{
            studentArea = data
            break
        }
    }
}
function getSocketID(actor,idArea){
    switch(actor){
        case 'parent' :{
            let area = parentsArea.filter(area => area.area == idArea)
            if (area.length>0) {
                return area[0]
            }else{
                return null
            }
            break
        }
        case 'student' :{
            return studentArea
            break
        }
    }

}
function removeSocketID(socket){
    for(let i=0;i<parentsArea.length;i++){
        if(socket == parentsArea[i].socket){
            parentsArea.splice(i,1)
            console.log('parent area removed');
            response = true 
        }
    }
}


