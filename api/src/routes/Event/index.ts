  
import express from "express";
import { handleError } from "../../utils/utils";
import AccountController from "./EventController";
import { wrapAsync } from "../../utils/utils";
import { logRoutes } from "../../utils/logging";

const router = express.Router();

router.get("", wrapAsync(AccountController.get));
router.post("", wrapAsync(AccountController.create));

logRoutes("/events", router);
router.use(handleError);

export default router;