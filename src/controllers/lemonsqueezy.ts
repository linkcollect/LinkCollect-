// import { STRIPE_SECRET_KEY, STRIPE_SIGNING_SECRET } from "../config";
import User, { IUser } from "../models/user";
const crypto = require('crypto');

import env from "../config/index";

// const STRIPE_SECRET_KEY: string = env.STRIPE_SECRET_KEY!; // Make sure STRIPE_SIGNING_SECRET has a value


const webhook = async (req, res) => {
  try {
    const sign = req.headers["x-signature"];
    let isLS = await verifyWebhookSignature(sign, req);
    if(!isLS) {
        console.log("not LS");
    } else {
        console.log("is LS");
        await fulfillTheOrder(req.body.data.attributes.user_email)
    }
    res.sendStatus(200);
  } catch (err: any) {
    console.log("ERROR", err.message);
    res.status(400).send(`Webhook error: ${err.message}`);
  }
};

async function verifyWebhookSignature(sign, request) {
    const secret: any    = env.LS_SIGNATURE_SECRET;

    const hmac : any     = crypto.createHmac('sha256', secret);
    const signature : any = Buffer.from(sign, 'utf8');
    const secondHmac : any = hmac.update(request.rawBody).digest('hex');
    const digest : any    = Buffer.from(secondHmac, 'utf8');

    if (!crypto.timingSafeEqual(digest, signature)) {
        return false
    }
    return true
} 

async function fulfillTheOrder(email) {
  const user = await User.findOneAndUpdate(
    { email: email },
    { isPremium: true }
  );
  console.log(user?.username,user?.isPremium);
}

const lemonsqueezyController = { webhook };

export default lemonsqueezyController;
