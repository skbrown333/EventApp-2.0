import express from "express";
import { handleError } from "../utils/utils";

import { default as AccountRouter } from "./Account";
import { default as EventRouter } from "./Event";

const router = express.Router();

router.use("/accounts", AccountRouter);
router.use("/events", EventRouter);


router.use(handleError);

export default router;