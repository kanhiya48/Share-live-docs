
const {createUniqueId}=require('../util/uniqueid')
const User = require("../Models/UserModel");
const Docs= require("../Models/DocsModel");
const jwt = require("jsonwebtoken");
const defaultValue = JSON.stringify({"ops":[{"insert":""}]});
module.exports.GetUniqueIdandCreateDoc = async (req, res, next) => {
  try {
    const userDetail=req.user;
    
    
     const id=await createUniqueId();
      const userDocs = userDetail.userDocs || [];
    const updatedUser = await User.findByIdAndUpdate(
    userDetail._id,
    { $push: { userDocs: {id:id , name:req.body.docname }} },
    { new: true } // To return the updated document
)
   
    if (!id) return;
   
    const document = await Docs.findById(id);
    if (!document) 
     {
     await Docs.create({ _id: id, name:req.body.docname , data: defaultValue });
 
     res.json({id :id , name : req.body.docname});
     }
     else{
      res.json({status:false , error:"error in creating document"});
     }
    next();
  } catch (error) {
    console.error(error);
  }
};
module.exports.GetUserDocs = async (req, res, next) => {
  try {
     const userdetail = req.user
    //  console.log("in getuserdocs  ",userdetail)
    

      const user = await User.findById(userdetail._id)
      // console.log(user.userDocs)
      if (user) return res.json({ docs: user.userDocs })
      else return res.json({ status: false })
   
 
    next();
  } catch (error) {
    console.error(error);
  }
};
module.exports.DeleteUserDocs = async (req, res, next) => {
  try {
    const userdetail = req.user;

    User.findOneAndUpdate(
      { _id: userdetail._id },
      { $pull: { userDocs: req.body.item } },
      { new: true },
      (err, user) => {
        if (err) {
          console.error(err);
          return res.json({ status: false });
        }
        
        if (!user) {
          return res.json({ status: false, message: 'User not found' });
        }

        // User found and document removed successfully
        res.json({ status: true, docs: user.userDocs });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};


module.exports.GetVisDocs = async (req, res, next) => {
  try {
     const userdetail = req.user
    //  console.log("in getuserdocs  ",userdetail)
    

      const user = await User.findById(userdetail._id)
      // console.log(user.userDocs)
      if (user) return res.json({ docs: user.visDocs })
      else return res.json({ status: false })
   
 
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.RemoveVisDocs = async (req, res, next) => {
  try {
    const userdetail = req.user;

    User.findOneAndUpdate(
      { _id: userdetail._id },
      { $pull: { visDocs: req.body.item } },
      { new: true },
      (err, user) => {
        if (err) {
          console.error(err);
          return res.json({ status: false });
        }
        
        if (!user) {
          return res.json({ status: false, message: 'User not found' });
        }

        // User found and document removed successfully
        res.json({ status: true, docs: user.visDocs });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};