

import mysql from 'mysql2';
import {config} from 'dotenv';
config()

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
}).promise()

const getFriends = async()=>{
    const [result] = await pool.query(`
    SELECT * FROM mates
    `)
    return result
}

 const getFriend = async(id)=>{
    const [result] = await pool.query(`
    SELECT * FROM mates
    WHERE id = ?
    `, [id])
    return result
}

const addFriend = async(name,age)=>{
    const [friend] = await pool.query(`
    INSERT INTO mates (name,age) VALUES (?,?)
    `,[name,age])
    return getFriend(friend.insertId)
}
// console.log(await addFriend('Darren', 52))

const deleteFriend = async(name)=>{
    const [friend] = await pool.query (`
    DELETE FROM mates WHERE name = ? 
    `, [name])
}
// console.log(await getFriend(1))

const editFriend = async(name, age, id)=>{
    const [friend] = await pool.query (`
    UPDATE mates
    SET name = ?, age = ?
    WHERE (id=?)
    `, [name, age, id])
    return friend
}

const newUser = async(username, password)=> {
    await pool.query(`
    INSERT INTO users (username, password)
    VALUES (?,?);
    `, [username, password])
}

const checkUser = async(username)=> {
    const [[{password}]] = await pool.query(`
    SELECT password FROM users WHERE username = ?
    `, [username])
    return password
}
console.log(await checkUser('tiger'))

// console.log(await addUser('mattdean', 'ueghsajif'))

export {getFriends, getFriend, addFriend, deleteFriend, editFriend, newUser, checkUser}