import { Router } from "express";
import { loginUser, logoutUser, registeruser } from "../controller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { refreshaccesstoken } from "../controller/user.controller.js";

const router = Router();

// before: without middleware
// router.route("/register").post(registeruser)

// after: with middleware
router.route("/register").post(
//router.route("/register").post(add file middleware , registeruser)
//here upload.fields is middleware

/*   If you want to use upload.fields() in routes:

    upload.fields([
        {name: "avatar",maxCount: 1},{name: "coverImage",maxCount: 1}])
        all the other things are present in req.body but there is no file field in req.body so we have to add manually and that's why this fields is in use
        using upload.field we can upload file using multer and access it using req.files
Then uploaded files become available in : req.files which we can use later    */

  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverimage", maxCount: 1 }
  ]),
  registeruser
);

router.route("/login").post(loginUser)
router.route("/logout").post( verifyJWT , logoutUser)
router.route("/refresh-token").post(refreshaccesstoken)

export default router;