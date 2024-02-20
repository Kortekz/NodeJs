

import express from 'express';
import cors from 'cors';
import {config} from 'dotenv';
import friendsRouter from './routes/friends.js'
import { addFriend, checkUser, deleteFriend , newUser} from './models/database.js'
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import router from './routes/friends.js';

(config)

const PORT = process.env.PORT

const app = express()


app.use(cors({
    origin:'http://localhost:8080',
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())

app.use(express.static('views'))

const authenticate = (req,res,next) => {
    let {cookie} = req.headers
    let tokenInHeader = cookie && cookie.split('=')[1]
    if(tokenInHeader===null) res.sendStatus(401)
    console.log(tokenInHeader)
    jwt.verify(tokenInHeader, process.env.SECRET_KEY, (err, user)=>{
        if(err)return res.sendStatus(403)
        req.user = user
        next()
    })
}
// authenticate must be below funtion
app.use('/friends', authenticate, friendsRouter)

// must always be at the top of code
// app.post('/login',authenticate, (req,res)=>{
//     const {username} = req.body
//     const token = jwt.sign({username:username}, process.env.SECRET_KEY,{expiresIn: '1h'})
//     res.cookie('jwt', token)
//     res.json({
//         msg: "You have logged in!"
//     })
// })

// app.patch

app.use('/friends', friendsRouter)

// app.use('login', addFriend)

// hash password
app.post('/users',(req,res)=>{
    const {username, password} = req.body
    bcrypt.hash(password, 10, async(err, hash)=> {
        if(err) throw err
        await newUser(username, hash)
        res.send({
            msg: "You have created an account"
        })
    })
})

// bcrypt auth
const auth = async(req,res,next) => {
    const {username, password} = req.body
    const hashedPassword = await checkUser(username)
    bcrypt.compare(password, hashedPassword, (err,result)=>{
        if(err) throw err
        if(result === true){
            const {username} = req.body
            const token = jwt.sign({username:username}, process.env.SECRET_KEY,{expiresIn: '1h'})
            // res.cookie('jwt', token, {httpOnly:false})
            // if set to true the front end user cannot access the cookie
            res.send({
                token: token,
                msg: 'You have logged in! YAY!'
            })
            next()
        }else{
            res.send({msg: 'The username or password is incorrect'})
        }
    })
}

app.post('/login',auth, (req,res)=> {
    // res.send({
    //     msg: 'You have logged in! YAY!'
    // })
})

// app.delete('/logOut',(req,res)=>{
//     res.clearCookie('jwt')
//     res.send({
//         msg: 'You have logged out'
//     })
// })

//     jwt.verify(token, 'my_secret_key', (err,user)=> {
//     // if no access
//     if(err) return res.sendStatus(403)
//     // access
//     req.user = user
//     next()
// })

app.listen(PORT,()=>{
    console.log(`It is running on http://localhost:${PORT}/`)
    })
