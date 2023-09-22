// import { STRIPE_SECRET_KEY, STRIPE_SIGNING_SECRET } from "../config";
import User, { IUser } from "../models/user";

import env from "../config/index";

// const STRIPE_SECRET_KEY: string = env.STRIPE_SECRET_KEY!; // Make sure STRIPE_SIGNING_SECRET has a value


const webhook = async (req, res) => {
  try {
    const sign = req.headers["X-Signature"];

    console.log("event", req.body);
    console.log("event signatature", sign);


    res.sendStatus(200);
  } catch (err: any) {
    console.log("ERROR", err.message);
    res.status(400).send(`Webhook error: ${err.message}`);
  }
};

// async function fulfillTheOrder(session) {
//   const user = await User.findOneAndUpdate(
//     { email: session.metadata.email },
//     { isPremium: true }
//   );
//   console.log(user);
// }

const lemonsqueezyController = { webhook };

export default lemonsqueezyController;
