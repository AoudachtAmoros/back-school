
async function addMessage(data){
    console.log('adding message ---');
    console.log(data);
    try {
        let message = new Message({  
            type: data.type,
            time: Date.now(),
            payload: data.payload,
            emitterID: data.emitterID,
            receiversID: data.receiversID,
            receiverID: data.receiversID[0],
            received:false,
            readed:false,
        })
        await message.save()
        return {status:true,data:message}
    } catch (err) {
        console.log(err)
        return {status:false,error:err}
    }
}
async function getConversations(ids) {
    try {
        // sanctum test
        const promiseConversation = await Message.find({'$or': [{emitterID: ids.emitterID}, {reciverID: ids.reciverID}]})
        if (!promiseConversation) {
            // no user
            console.log('conversation not found');
            return {status:false,error:{status:404,error:'user conversation found'}}
        } else { 
            console.log('conversation found');
            console.log(promiseConversation);
            return {status:true,data:promiseConversation}
        }
    } catch (err) {
        console.log('error',err);
        return {status:false,error:{status:500,error:err}}
    }
}
async function getConversation(UserData) {
    try {
        // sanctum test
        const promiseConversation = await Conversation.find()
           .select({'conversations': {$elemMatch: {'membersId':['9ba58ea-3a3d-4ea1-913e-160dd082d3d3','c598f849-abb2-4407-b489-33711f38f274']}}})
        if (!promiseConversation) {
            // no user
            // console.log('conversation not found');
            // return {status:false,error:{status:404,error:'user not found'}}
        } else { 
            console.log('conversation found');
            // console.log(promiseConversation);

            // return {status:true,data:promiseConversation}
        }
    } catch (err) {
        console.log('error',err);

        // return {status:false,error:{status:500,error:err}}
    }
}
async function createConversation(data){
    return
    try {
        let conversation = new Conversation({
            membersId : ['9ba258ea-3a3d-4ea1-913e-160dd082d3d3','c598f849-abb2-4407-b489-33711f38f274'],
            time : Date.now()
        })
        await conversation.save()

        return {status:true,data:conversation}
    } catch (err) {
       console.log(err)
       return {status:false,error:err}
    }
}
async function login(req, res, data, next) {
    try {
        await dbConnection(req, res)
        const promisUser = await User.findOne({ email: data.email })
        if (!promisUser) {
            res.status(400)
            res.send({ message: 'invalid email' })
        } else {
            const valid = await bcrypt.compare(data.password, promisUser.password)
            if (!valid) {
                res.status(400)
                res.send({ message: 'invalid password' })
            } else {
                const token = jwt.sign({ _id: promisUser._id, isAdmin: promisUser.isAdmin }, process.env.UserjwtPrivateKey)
                res.header('x-auth-token', token).send({ message: 'logged In' })
            }
        }
    } catch (ex) {
        next(ex)
    }
} // login
async function currentUser(req, res, next) {
    try {
        await dbConnection()
        const promisUser = await User.findById(req.user._id)
            .select('-__v')
            .select('-password')
        res.send(promisUser)
    } catch (ex) {
        next(ex)
    }
}
// currentUser
async function remove(req, res) {
    res.send('remove')
}
module.exports.createConversation = createConversation
module.exports.getConversation = getConversation
module.exports.getConversations = getConversations
module.exports.addMessage = addMessage
module.exports.login = login
module.exports.currentUser = currentUser
module.exports.remove = remove