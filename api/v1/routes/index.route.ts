import { Express } from "express";

import { taskRoutes } from "./task.route";   
import { userRoute } from "./user.route";

import * as authMiddleWare from "../middleware/auth.middleware";
// const authMiddleWare = require("../middleware/auth.middleware.js");

const mainV1Routes = (app: Express) : void => {
    const version = "/api/v1";

    app.use(version + "/tasks",authMiddleWare.requireAuth, taskRoutes);

    app.use(version + "/users", userRoute);
};

export default mainV1Routes;