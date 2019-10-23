import express from "express";
import { handleError } from "../utils/utils";

import { default as AccountRouter } from "./Account";

const router = express.Router();

router.use("/accounts", AccountRouter);


router.use(handleError);

export default router;