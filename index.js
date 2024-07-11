const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override")
const Chat = require("./models/chats")
const ExpressError = require("./ExpressError");

const port = 8080;
const app = express();

const path = require("path");

app.set("view engine" , "ejs");

app.set("views",path.join( __dirname,"views"));
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))

main().then(() => {
    console.log("connection sucessful")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp'); 
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.get("/", (req,res) => {
    console.log("req came")
    res.send("working")
})

app.listen(port, () => {
    console.log("Server is listening on port 8080");
})

app.get("/chats", async (req,res,next) => {
    try {
        let chats = await Chat.find();
        // console.log(chats);
        // res.send("working on chats")
        res.render("chatsweb.ejs", {chats})
        
    } catch (error) {
        console.log(error.message);
        next(error);
      
    }
})

app.get("/chats/new", (req,res) => {
    //test error
    // throw new ExpressError('Page Not Found:',404);

    // let chats = await Chat.find();
    // console.log(chats);
    // res.send("working on chats")
    res.render("newchat.ejs")
})

app.post("/chats",async (req,res,next) => {
    try {
        let {from, to ,message} = req.body;
        let newChat = new Chat({
           from: from,
           to: to,
           message: message,
           created_at: new Date(),
        }) 
        
        await newChat.save();
        res.redirect('/chats');
        
    } catch (error) {
        console.log(error.message);
        next(error);
    }

   
})



//NEW - SHOW ROUTE  
app.get("/chats/:id/edit", async (req,res,next) => {
    try {
        let {id} = req.params;
        let chat = await Chat.findById(id);
        if( !chat ){
            throw new ExpressError('chat not found',404);
        }
        res.render("edit.ejs",{chat});
    } catch (error) {
        console.log(error.message);
        next(error);
    }
})



app.put("/chats/:id/edit", async (req,res,next) => {
    try {
        let {id} = req.params;
        let { msg: newmsg } = req.body;
        console.log("msg :",newmsg, "  id:",id);
    
        let updatedChat = await Chat.findByIdAndUpdate(id,{ message: newmsg}, {runValidators: true , new: true})
        console.log("now :",updatedChat);
        // let chat = await Chat.findById(id);
        // console.log(chats);
        // res.send("working on chats")
        res.redirect("/chats")
        
    } catch (error) {
        console.log(error.message);
        next(error);

    }
})


app.delete("/chats/:id/delete", async (req,res,next) => {
    try {
        let {id} = req.params;
        let chat = await Chat.findByIdAndDelete(id)
        console.log("now :",chat);
    
        // let updatedChat = await Chat.findByIdAndUpdate(id,{ message: newmsg}, {runValidators: true , new: true})
        // let chat = await Chat.findById(id);
        // console.log(chats);
        // res.send("working on chats")
        res.redirect("/chats")
        
    } catch (error) {
        console.log(error.message);
        next(error);

    }
})

//Error Handling Middleware
app.use((err,req,res,next)=> {
    let {status=500 , message= "unknown Erorr"} = err;
    res.status(status).send(message);
})

