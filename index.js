const express=require('express')
const app=express()
app.use(express.json())
const db=require('./database/db.js')
const port=process.env.PORT
const User = require("./routes/user/user")
app.use('/user', User)
// app.use('/',require('./routers/index.js'))

app.listen(port,()=>{
    console.log(`server is running on port  ${port}....`);
});
