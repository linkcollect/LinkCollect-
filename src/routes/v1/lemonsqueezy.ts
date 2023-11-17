import express from "express";
import lemonsqueezyController from "../../controllers/lemonsqueezy";
const router = express.Router();


router.post("/webhook", lemonsqueezyController.webhook );


export default router;