// import { STRIPE_SECRET_KEY, STRIPE_SIGNING_SECRET } from "../config";
import User, { IUser } from "../models/user";
const crypto = require('crypto');

import env from "../config/index";

// const STRIPE_SECRET_KEY: string = env.STRIPE_SECRET_KEY!; // Make sure STRIPE_SIGNING_SECRET has a value


const webhook = async (req, res) => {
  try {
    const sign = req.headers["x-signature"];

    console.log("req sign", sign);
    console.log("event", req.body, req.body.data.attributes.user_email);
    let isLS = verifyWebhookSignature(sign, req);

    if(!isLS) {
        console.log("not LS");
    }

    res.sendStatus(200);
  } catch (err: any) {
    console.log("ERROR", err.message);
    res.status(400).send(`Webhook error: ${err.message}`);
  }
};

async function verifyWebhookSignature(sign, request) {

    const secret    = env.LS_SIGNATURE_SECRET;
    const hmac      = crypto.createHmac('sha256', secret);
    console.log("raw body", request.rawBody)
    const digest    = Buffer.from(hmac.update(request.rawBody).digest('hex'), 'utf8');
    const signature = Buffer.from(sign || '', 'utf8');
    console.log("signature", signature);
    console.log("digest", digest);

    if (!crypto.timingSafeEqual(digest, signature)) {
        return false
    }
    return true

    }

// async function fulfillTheOrder(session) {
//   const user = await User.findOneAndUpdate(
//     { email: session.metadata.email },
//     { isPremium: true }
//   );
//   console.log(user);
// }

const lemonsqueezyController = { webhook };

export default lemonsqueezyController;
