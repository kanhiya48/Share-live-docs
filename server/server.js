const express = require('express');
const mongoose = require("mongoose");
const http = require('http');
const cors = require('cors');
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");
const { MONGO_URL, PORT } = process.env;
const defaultValue = JSON.stringify({"ops":[{"insert":""}]});
const authenticateSocket = require('./Middlewares/socketMiddleware');
const path = require('path');
const User = require('./Models/UserModel');
const Docs=require('./Models/DocsModel')
// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
); // Enable CORS for all routes
app.use(cookieParser());

// Route
app.use("/", authRoute);

// Create HTTP server
const server = http.createServer(app);




//deployment........................

const __dirname1=path.resolve();

if(process.env.DEPLOYMENT==='true'){
  app.use(express.static(path.join(__dirname1,'/build')));
  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname1,"build","index.html"));
  })
}
//deployment........................








// MongoDB connection
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    // Define MongoDB model
  
    // Socket.io initialization
    var io = require('socket.io')(server, { 
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});



   async function addtoVisitedDoc(document,Uid){
      try{
          
    // Find the user by _id (Uid)
    const user = await User.findById(Uid)

    // If user is not found, handle the case
    if (!user) {
      console.log('User not found.');
      return; // Or you can throw an error
    }

    // Check if the documentId exists in userDoc array
    const isDocumentExists = user.userDocs.some(doc => doc.id === document._id);
    const isDocumentExists1 = user.visDocs.some(doc => doc.id === document._id);


    // If the documentId is not found in userDoc array, update the user document
    if (!isDocumentExists && !isDocumentExists1) {
      // Add documentId to vidDoc array
      // console.log("documentname",document)
      
      user.visDocs.push({id:document._id, name:document.name});

      // Save the updated user document
      await user.save();

      console.log('DocumentId added to vidDoc array.');
    } else {
      console.log('DocumentId already exists in userDoc array.');
    }
  } catch (error) {
    console.error('Error:', error);
    // Handle errors appropriately
  }
      }
   






   async function findDocument(id) {
  try {
    if (!id) return;
    // console.log("id ",id)
    const document = await Docs.findById(id);
    // console.log("document ",document)
    if (document) return document;

  
  } catch (error) {
    console.error('Error finding or creating document:', error);
  }
}
    // Socket.io event handlers
    io.on("connection", socket => {
       authenticateSocket(socket, async err => {
    if (err) {
      console.error('Socket authentication error:', err);
      return socket.disconnect(true);
    }
      socket.on("get-document", async (documentId) => {
        
        const document = await findDocument(documentId);
        socket.join(documentId);
        if(document!=undefined){
          // console.log("docs  ",document)
        socket.emit("load-document", document);
         await addtoVisitedDoc(document,socket.user);}
        socket.on("send-changes", delta => {
          // console.log("changes")
          socket.broadcast.to(documentId).emit("receive-changes", delta);
        });
    
        socket.on("save-document", async data => {
          try {
            // console.log("data",data)
            await Docs.findByIdAndUpdate(documentId, { data:JSON.stringify(data) });
          } catch (error) {
            console.error('Error saving document:', error);
          }
        });
      });
    });
 });
    // Start server
    const port = PORT || 5000;
    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
   
     });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });
mongoose.set('useFindAndModify', false);
// Function to find or create document

