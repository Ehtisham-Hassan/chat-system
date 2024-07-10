const mongoose = require("mongoose");
const Chat = require("./models/chats");

// const Chat = require("./models/chats")

main().then(() => {
    console.log("connection sucessdul")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp'); 
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

let chats = [{
    from: "Ahmed",
    to: "Ehtisham",
    message: "Ehtisham kidr ha",
    created_at: new Date()
},{
    from: "Ahmed",
    to: "Ehtisham",
    message: "Message 2",
    created_at: new Date()
},{
    from: "Ehtisham",
    to: "Ahmed",
    message: "ha jnai working on it",
    created_at: new Date()
},{
    from: "Ehtisham",
    to: "Ahmed",
    message: "coding done an ddeployed",
    created_at: new Date()
}
]

Chat.insertMany(chats)
