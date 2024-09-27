const express=require('express')
const env=require('dotenv')
const mongoose =require('mongoose')
const cors=require('cors');
const app=express();
const userRoute=require("./Routes/userRoute")
const storyRoute=require("./Routes/storyRoute")

env.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/auth",userRoute);
app.use("/story",storyRoute);

const PORT=process.env.PORT
const MONGO_URL=process.env.MONGO_URL

app.get('/',(req,res)=>{
    res.send('Hello World');
})


app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})

mongoose.connect( MONGO_URL).then(()=>{
    console.log("Db Connected")
}).catch((error)=>{
    console.log(error)
})