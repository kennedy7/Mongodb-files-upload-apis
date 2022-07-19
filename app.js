const express = require ('express');
const bodyParser = require ('body-parser')
const app = express()
const port = process.env.PORT || 7000;
const methodOverride = require ('method-override');
const router = require ('./routes')
const dbSetup = require ('./db')

//Middleware
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.set("view engine", "ejs")


dbSetup()



app.use(router)
app.listen(port, ()=>{
    console.log(`app is running on port ${port}`)
})