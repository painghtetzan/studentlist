const express = require('express')
const sql = require('mysql2/promise')
require('dotenv').config()
const port = 3000
const app = express()
app.use(express.json())

const dbConfig = {
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE,
    port:process.env.DB_PORT,
    waitForConnections:true,
    connectionLimit:100,
    queueLimit:0
}

app.listen(port,(req,res)=>{
    console.log('server started!')
})

app.get('/all',async(req,res)=>{
    try{
        let connect = await sql.createConnection(dbConfig)
        let [rows] = await connect.execute('SELECT * FROM defaultdb.studentlist')
        res.status(200).send(rows)
    }catch(err){
        console.error(err)
    }
})

app.post('/add',async(req,res)=>{
    const {name,age} = req.body
    try{
        let connect = await sql.createConnection(dbConfig)
        await connect.execute('INSERT INTO defaultdb.studentlist (student_name,student_age) VALUES (?,?)',[name,age])
        res.status(201).send(`inserted ${name,age} to database`)
    }catch(err){
        console.error(err)
    }
})

app.post('/delete/:id',async(req,res)=>{
    const id = req.params.id
    try{
        let connect = await sql.createConnection(dbConfig)
        await connect.execute('DELETE FROM defaultdb.studentlist WHERE id=?',[id])
        res.status(204).send('successfully deleted!')
    }catch(err){
        console.error(err,'error deleting')
    }
 })

app.post('/edit/:id',async(req,res)=>{
    const id = req.params.id
    const {name,age} = req.body
    try{
        let connect = await sql.createConnection(dbConfig)
        await connect.execute('UPDATE defaultdb.studentlist SET student_name=?, student_age=? WHERE id=?',[name,age,id])
        res.status(203).send('successfully updated')
    }catch(err){
        console.error(err)
    }
})