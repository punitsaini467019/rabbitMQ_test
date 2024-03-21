const expres = require("express")
const amqp = require("amqplib/callback_api")
const app = expres()
const PORT = 3000

app.get("/users",(req,res)=> {
    const data = {
        id:1,
        name:"Punit",
        age : 24,
        number:12212113
    }
    amqp.connect("amqp://localhost",(err,connection)=>
    {
        if(err){
            throw err
        }
        connection.createChannel((err,channel)=>{
            if(err){
                throw err
            }
            const queue = "message_queue_user"
            const message = JSON.stringify(data)
            channel.assertQueue(queue,{durable:false})
            channel.sendToQueue(queue,Buffer.from(message))

            console.log(`sent ${message} to ${queue}`)
        })

    })
    res.send("Message from Users Service")
})

app.listen(PORT,()=> console.log(`Users service run on port number ${PORT}`))