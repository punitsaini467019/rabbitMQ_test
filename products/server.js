const expres = require("express")
const amqp = require("amqplib/callback_api")
const app = expres()
const PORT = 3001

app.get("/products",(req,res)=> {
    amqp.connect("amqp://localhost",(err,connection)=>{
       if(err){
        throw err
       }
       connection.createChannel((err,channel)=>{
        if(err){
            throw err
        }
        const queue = "message_queue_user"
        // channel.assertQueue(queue,{durable:false})
        console.log("waiting for the message")
        channel.consume(queue,async(message)=>{
            console.log("message+++++",message.content.toString())
            await res.send(message.content.toString())
        },{noAck:true})
       })
    })
})

app.listen(PORT,()=> console.log(`Products service run on port number ${PORT}`))