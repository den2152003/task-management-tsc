import { Router } from "express";

const router: Router = Router();

import  * as controller from "../controller/user.controller";

import * as authMiddleWare from "../middleware/auth.middleware";


router.post("/register", controller.register);

router.post("/login", controller.login);

router.post('/password/forgot', controller.forgotPassword);

router.post('/password/otp', controller.otpPassword);

router.post('/password/reset', controller.resetPassword);

router.get('/detail', authMiddleWare.requireAuth, controller.detail);

router.get('/list', authMiddleWare.requireAuth, controller.list);



export const userRoute: Router = router;