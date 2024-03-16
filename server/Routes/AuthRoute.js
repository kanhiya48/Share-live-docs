const { Signup, Login } = require("../Controllers/AuthController");
const { GetUniqueIdandCreateDoc, GetUserDocs, DeleteUserDocs, GetVisDocs, RemoveVisDocs } = require("../Controllers/DocumentController");
const { userVerification, apiMiddleware } = require("../Middlewares/AuthMiddleware");
const router = require("express").Router();

router.post("/signup", Signup);
router.post('/login', Login)
router.post('/',userVerification)
router.post('/getuniqueidandcreatedoc',apiMiddleware,GetUniqueIdandCreateDoc);
router.post('/getuserdocs',apiMiddleware,GetUserDocs);
router.post('/deletedoc',apiMiddleware,DeleteUserDocs);
router.post('/getvisdocs',apiMiddleware,GetVisDocs);
router.post('/removevisdoc',apiMiddleware,RemoveVisDocs);

module.exports = router;