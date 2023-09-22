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
    let isLS = verifyWebhookSignature(sign, req.body);

    if(!isLS) {
        console.log("not LS");
    }

    res.sendStatus(200);
  } catch (err: any) {
    console.log("ERROR", err.message);
    res.status(400).send(`Webhook error: ${err.message}`);
  }
};

async function verifyWebhookSignature(sign, payload) {
    // Calculate the expected signature based on the request body and secret key
        const expectedSignature = crypto
        .createHmac('sha256', env.LS_SIGNATURE_SECRET)
        .update(payload)
        .digest('hex');

        console.log("expectedSignature", expectedSignature);
        console.log("sign", sign);
    // Compare event signature to expected signature
        if (sign == expectedSignature) {
            return true
        }
        else {
            return false
        }
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
