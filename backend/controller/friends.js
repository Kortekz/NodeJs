

import {getFriends, getFriend, addFriend, deleteFriend, editFriend} from '../models/database.js'


export default {
    // getFriends is the name of the method we call to call the specific funtion, we always have to use dot notation
    getMany: async(req,res)=>{
        res.send(await getFriends())
        },

    postMany: async (req,res)=>{
        const {name,age} = req.body
        const post = await addFriend(name,age)
        res.send(await getFriends())
        },

    getID: async(req,res)=>{
        res.send(await getFriend(+req.params.id))
        },

    deleteID: async (req,res)=>{
        await deleteFriend(req.params.name)
        res.json(await getFriends())
        },

    patchID: async (req,res)=>{
        const [friend] = await getFriend(+req.params.id)
        let {name,age} = req.body
        name ? name = name: {name} = friend
        age ? age = age: {age} = friend
        await editFriend(name,age,+req.params.id)
        res.json(await getFriends())
        }

}
